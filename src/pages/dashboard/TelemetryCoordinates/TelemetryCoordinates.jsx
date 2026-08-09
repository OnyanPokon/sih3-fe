import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, ColorPicker, Skeleton, Space } from 'antd';
import { TelemetryCoordinates as TelemetryCoordinateModel } from '@/models';
import React from 'react';
import { Action, InputType } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields.js';
import { TelemetryCoordinatesService } from '@/services';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { DELETE, UPDATE, READ } = Action;

const TelemetryCoordinates = () => {
  const modal = useCrudModal();
  const params = useParams();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllTelemetryCoordinates } = useAbortableService(TelemetryCoordinatesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllTelemetryCoordinates.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchTelemetryCoordinates = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search,
      pos_pengamatan_id: params.pos_pengamatan_id
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, params.pos_pengamatan_id, token]);

  React.useEffect(() => {
    fetchTelemetryCoordinates();
  }, [fetchTelemetryCoordinates, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const telemetryCoordinates = getAllTelemetryCoordinates.data ?? [];

  const storeTelemetryCoordinate = useService(TelemetryCoordinatesService.store, onUnauthorized);
  const updateTelemetryCoordinate = useService(TelemetryCoordinatesService.update, onUnauthorized);
  const deleteTelemetryCoordinate = useService(TelemetryCoordinatesService.delete, onUnauthorized);
  const importTelemetryCoordinate = useService(TelemetryCoordinatesService.import, onUnauthorized);

  const column = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      sorter: (a, b) => a.date.length - b.date.length,
      searchable: true
    },
    {
      title: 'Waktu',
      dataIndex: 'time',
      sorter: (a, b) => a.time.length - b.time.length,
      searchable: true
    },
    {
      title: 'Warna',
      dataIndex: 'color',
      sorter: (a, b) => a.color.length - b.color.length,
      searchable: true,
      render: (record) => <ColorPicker defaultValue={record} disabled showText />
    },
    {
      title: 'Nilai',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating.length - b.rating.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, TelemetryCoordinateModel], [DELETE, TelemetryCoordinateModel], [READ, TelemetryCoordinateModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.TELEMETRY_COORDINATE}`}
            model={TelemetryCoordinateModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.TELEMETRY_COORDINATE}`,
                data: { ...record, date: dayjs(record.date), time: dayjs(record.time, 'HH:mm') },
                formFields: formFields(),
                onSubmit: async (values) => {
                  const payload = {
                    _method: 'PUT',
                    observation_pos_id: params.pos_pengamatan_id,
                    date: values.date?.format('YYYY-MM-DD'),
                    time: values.time?.format('HH:mm'),
                    color: values.color?.toHexString?.() ?? values.color,
                    rating: values.rating
                  };

                  const { message, isSuccess } = await updateTelemetryCoordinate.execute(record.id, payload, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTelemetryCoordinates({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }

                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.TELEMETRY_COORDINATE}`}
            model={TelemetryCoordinateModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.TELEMETRY_COORDINATE}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteTelemetryCoordinate.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchTelemetryCoordinates({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.TELEMETRY_COORDINATE}`,
      formFields: formFields(),
      onSubmit: async (values) => {
        const payload = {
          observation_pos_id: params.pos_pengamatan_id,
          date: values.date?.format('YYYY-MM-DD'),
          time: values.time.format('HH:mm'),
          color: values.color?.toHexString(),
          rating: values.rating
        };

        const { message, isSuccess } = await storeTelemetryCoordinate.execute(payload, token);

        if (isSuccess) {
          success('Berhasil', message);
          fetchTelemetryCoordinates({ token: token, page: pagination.page, per_page: pagination.per_page });
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
          label: `File ${Modul.TELEMETRY_COORDINATE} `,
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
          rules: [{ required: true, message: 'file harus diisi' }]
        }
      ],
      title: `Import ${Modul.TELEMETRY_COORDINATE} `,
      onSubmit: async (values) => {
        const { message, isSuccess } = await importTelemetryCoordinate.execute({ ...values, pos_pengamatan_id: params.pos_pengamatan_id }, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchTelemetryCoordinates({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card
      title={
        <DataTableHeader
          model={TelemetryCoordinateModel}
          onImport={{ templateFile: 'koordinat_telemetri.xlsx', importHandler: onImport }}
          modul={Modul.TELEMETRY_COORDINATE}
          onStore={onCreate}
          selectedData={selectedData}
          onSearch={(values) => setFilterValues({ ...filterValues, search: values })}
        />
      }
    >
      <Skeleton loading={getAllTelemetryCoordinates.isLoading}>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={telemetryCoordinates}
            columns={column}
            loading={getAllTelemetryCoordinates.isLoading}
            map={(Telemetri) => ({ key: Telemetri.id, ...Telemetri })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default TelemetryCoordinates;
