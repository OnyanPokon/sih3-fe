import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { ObservationPos as ObservationPosModel } from '@/models';
import React from 'react';
import { Action, InputType } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields.js';
import { ObservationPosService, PosTypesService } from '@/services';

const { DELETE, UPDATE, READ } = Action;

const ObservationPos = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllObservationPos } = useAbortableService(ObservationPosService.getAll, { onUnauthorized });
  const { execute: fetchPosTypes, ...getAllPosTypes } = useAbortableService(PosTypesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllObservationPos.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchObservationPos = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchObservationPos();
    fetchPosTypes({ token: token });
  }, [fetchObservationPos, fetchPosTypes, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const observationPos = getAllObservationPos.data ?? [];
  const posTypes = getAllPosTypes.data ?? [];

  const storeObservationPos = useService(ObservationPosService.store, onUnauthorized);
  const updateObservationPos = useService(ObservationPosService.update, onUnauthorized);
  const deleteObservationPos = useService(ObservationPosService.delete, onUnauthorized);
  const importObservationPos = useService(ObservationPosService.import, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Jenis Pos',
      dataIndex: ['pos_type_id', 'name'],
      sorter: (a, b) => a.pos_type_id.name.length - b.pos_type_id.name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, ObservationPosModel], [DELETE, ObservationPosModel], [READ, ObservationPosModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.OBSERVATION_POS}`}
            model={ObservationPosModel}
            onClick={() => {
              const coordinates = record?.coordinate;
              const [longitude = '', latitude = ''] = coordinates.split(',').map((coord) => coord.trim());
              modal.edit({
                title: `Edit ${Modul.OBSERVATION_POS}`,
                data: { ...record, longitude: longitude, latitude: latitude, pos_type_id: record.pos_type_id.id },
                formFields: formFields({ options: { posTypes: posTypes } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateObservationPos.execute(record.id, { ...values, coordinate: `${values.latitude},${values.longitude}` }, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchObservationPos({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.OBSERVATION_POS}`}
            model={ObservationPosModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.OBSERVATION_POS}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteObservationPos.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchObservationPos({ token: token, page: pagination.page, per_page: pagination.per_page });
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

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.OBSERVATION_POS}`,
      formFields: formFields({ options: { posTypes: posTypes } }),
      onSubmit: async (values) => {
        const payload = { ...values, coordinate: `${values.latitude},${values.longitude}` };
        const { message, isSuccess } = await storeObservationPos.execute(payload, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchObservationPos({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  const onImport = () => {
    modal.create({
      formFields: [
        {
          label: `File ${Modul.OBSERVATION_POS} `,
          name: 'file',
          type: InputType.UPLOAD,
          max: 1,
          beforeUpload: () => {
            return false;
          },
          getFileList: (data) => {
            return [
              {
                url: data?.file,
                name: data?.name
              }
            ];
          },
          accept: ['.xlsx'],
          rules: [{ required: true, message: 'Logo harus diisi' }]
        }
      ],
      title: `Import ${Modul.OBSERVATION_POS} `,
      onSubmit: async (values) => {
        const { message, isSuccess } = await importObservationPos.execute(values, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchObservationPos({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllObservationPos.isLoading}>
        <DataTableHeader
          model={ObservationPosModel}
          onImport={{ templateFile: 'pos_pengamatan.xlsx', importHandler: onImport }}
          modul={Modul.OBSERVATION_POS}
          onStore={onCreate}
          selectedData={selectedData}
          onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
        />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={observationPos}
            columns={column}
            loading={getAllObservationPos.isLoading}
            map={(category) => ({ key: category.id, ...category })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default ObservationPos;
