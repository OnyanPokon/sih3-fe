import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { Maps as MapModel } from '@/models';
import React from 'react';
import { Action, InputType } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { EnvironmentOutlined, ExpandAltOutlined, ExpandOutlined } from '@ant-design/icons';
import MapsService from '@/services/MapsService.js';
import { formFields } from './FormFields';
import { CategoriesService } from '@/services';

const { DELETE, UPDATE } = Action;

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
    fetchCategories({ token: token, per_page: 'all' });
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
    },
    {
      title: 'Nama',
      dataIndex: 'geometry',
      sorter: (a, b) => a.geometry.length - b.geometry.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, MapModel], [DELETE, MapModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.MAPS}`}
            model={MapModel}
            onClick={() => {
              let fields = [...formFields({ options: { categories } })];
              if (record.geometry === 'point') {
                fields.push({
                  label: `Marker ${Modul.MAPS}`,
                  name: 'marker',
                  type: InputType.SELECT_ICON,
                  rules: [
                    {
                      required: true,
                      message: `Marker ${Modul.MAPS} harus diisi`
                    }
                  ]
                });
              }
              modal.edit({
                title: `Edit ${Modul.MAPS}`,
                data: {
                  ...record,
                  category_id: record.category_id.id
                },
                formFields: () => fields,
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateMap.execute(
                    record.id,
                    {
                      ...values,
                      _method: 'PUT',
                      type: 'upload',
                      geometry: record.geometry
                    },
                    token,
                    values.file?.file
                  );

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchMaps({
                      token,
                      page: pagination.page,
                      per_page: pagination.per_page
                    });
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
        </Space>
      )
    });
  }

  const modalCreate = (geometry) => {
    let fields = [...formFields({ options: { categories } })];
    if (geometry === 'point') {
      fields.push({
        label: `Marker ${Modul.MAPS}`,
        name: 'marker',
        type: InputType.SELECT_ICON,
        rules: [
          {
            required: true,
            message: `Marker ${Modul.MAPS} harus diisi`
          }
        ]
      });
    }
    modal.create({
      title: `Tambah ${Modul.MAPS}`,
      formFields: fields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeMap.execute({ ...values, geometry: geometry, type: 'upload' }, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchMaps({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onCreate = () => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-4 flex items-center justify-center gap-x-4">
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                modalCreate('point');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <EnvironmentOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Point</span>
                <small className="text-center text-gray-500">Data spasial titik koordinat.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                modalCreate('polyline');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ExpandAltOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Polyline</span>
                <small className="text-center text-gray-500">Data spasial garis koordinat.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                modalCreate('polygon');
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <ExpandOutlined className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">Polygon</span>
                <small className="text-center text-gray-500">Data spasial area koordinat.</small>
              </div>
            </Card>
          </div>
        )
      }
    });
  };

  return (
    <Card title={<DataTableHeader model={MapModel} modul={Modul.MAPS} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />}>
      <Skeleton loading={getAllMaps.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={maps} columns={column} loading={getAllMaps.isLoading} map={(map) => ({ key: map.id, ...map })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Maps;
