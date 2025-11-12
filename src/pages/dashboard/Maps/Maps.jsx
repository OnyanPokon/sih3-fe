import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Dropdown, Skeleton, Space, Tooltip } from 'antd';
import { Maps as MapModel } from '@/models';
import React from 'react';
import { Action, InputType } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined, DownOutlined, EnvironmentOutlined, ExpandAltOutlined, ExpandOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import MapsService from '@/services/MapsService.js';
import { formFields } from './FormFields';
import { CategoriesService } from '@/services';

const { DELETE, UPDATE, READ } = Action;

const Maps = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllMaps } = useAbortableService(MapsService.getAll, { onUnauthorized });
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllMaps.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchMaps = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchMaps();
    fetchCategories({ token: token });
  }, [fetchCategories, fetchMaps, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const maps = getAllMaps.data ?? [];
  const categories = getAllCategories.data ?? [];

  const storeMap = useService(MapsService.store, onUnauthorized);
  const updateMap = useService(MapsService.update, onUnauthorized);
  const deleteMap = useService(MapsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'map_name',
      sorter: (a, b) => a.map_name.length - b.map_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, MapModel], [DELETE, MapModel], [READ, MapModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.MAPS}`}
            model={MapModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.MAPS}`,
                data: record,
                // formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateMap.execute(record.id, { ...values, _method: 'PUT' }, token, values.logo.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMaps({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.MAPS}`}
            model={MapModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.MAPS}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteMap.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMaps({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Tooltip title="Dataset">
            <Button icon={<DatabaseOutlined />} variant="outlined" color="primary" />
          </Tooltip>
        </Space>
      )
    });
  }

  const menuItems = [
    {
      key: '1',
      label: 'Upload',
      icon: <UploadOutlined />,
      children: [
        { key: '1-1', label: 'Point', icon: <EnvironmentOutlined /> },
        { key: '1-2', label: 'Polyline', icon: <ExpandAltOutlined /> },
        { key: '1-3', label: 'Polygon', icon: <ExpandOutlined /> }
      ]
    },
    {
      key: '2',
      label: 'Manual',
      icon: <UploadOutlined />,
      children: [
        { key: '2-1', label: 'Point', icon: <EnvironmentOutlined /> },
        { key: '2-2', label: 'Polyline', icon: <ExpandAltOutlined />, disabled: true },
        { key: '2-3', label: 'Polygon', icon: <ExpandOutlined />, disabled: true }
      ]
    }
  ];

  const onCreate = (key) => {
    const [parentKey, childKey] = key.split('-');
    let fields = formFields({ options: { categories } });

    switch (key) {
      // --- Upload Mode (File GeoJSON)
      case '1-1':
      case '1-2':
      case '1-3': {
        fields.push({
          label: `File ${Modul.MAPS}`,
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => false,
          getFileList: (data) => [
            {
              url: data?.logo,
              name: data?.name
            }
          ],
          accept: ['.geojson']
        });
        break;
      }

      // --- Manual Input Mode (Point)
      case '2-1': {
        fields.push(
          {
            label: 'Lokasi',
            type: InputType.MAP_PICKER
          },
          {
            label: 'Latitude',
            name: 'latitude',
            type: InputType.TEXT,
            rules: [{ required: true, message: 'Latitude harus diisi' }]
          },
          {
            label: 'Longitude',
            name: 'longitude',
            type: InputType.TEXT,
            rules: [{ required: true, message: 'Longitude harus diisi' }]
          }
        );
        break;
      }

      // --- Placeholder untuk case lain di masa depan
      default: {
        break;
      }
    }

    const geometryMap = {
      1: 'point',
      2: 'polyline',
      3: 'polygon'
    };

    modal.create({
      title: `Tambah ${Modul.MAPS}`,
      formFields: fields,
      onSubmit: async (values) => {
        const payload = {
          ...values,
          type: parentKey === '1' ? 'upload' : 'manual',
          geometry: geometryMap[childKey]
        };

        // Tambahkan koordinat jika manual point
        if (parentKey === '2' && childKey === '1') {
          payload.coordinates = [String(values.latitude), String(values.longitude)];
        }

        const fileData = parentKey === '1' && values.file?.file ? values.file.file : null;

        const { message, isSuccess } = await storeMap.execute(payload, token, fileData);

        if (isSuccess) {
          success('Berhasil', message);
          fetch({ token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }

        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllMaps.isLoading}>
        <DataTableHeader model={MapModel} modul={Modul.MAPS} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="flex w-full items-center justify-end">
          {user?.eitherCan([UPDATE, MapModel], [DELETE, MapModel], [READ, MapModel]) && (
            <Dropdown
              trigger={['click']}
              menu={{
                items: menuItems,
                onClick: (e) => onCreate(e.key)
              }}
            >
              <Button type="primary" className="mb-4" icon={<PlusOutlined />}>
                <Space>
                  Tambah
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={maps} columns={column} loading={getAllMaps.isLoading} map={(map) => ({ key: map.id, ...map })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Maps;
