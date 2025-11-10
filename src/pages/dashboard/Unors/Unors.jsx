import { Delete, Detail, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Image, Skeleton, Space } from 'antd';
import { Unors as UnorModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields.jsx';
import { GlobalOutlined } from '@ant-design/icons';
import UnorsService from '@/services/UnorsService.js';

const { DELETE, UPDATE, READ } = Action;

const Unors = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllUnors } = useAbortableService(UnorsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllUnors.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchUnors = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchUnors();
  }, [fetchUnors, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const unors = getAllUnors.data ?? [];

  const storeUnor = useService(UnorsService.store, onUnauthorized);
  const updateUnor = useService(UnorsService.update, onUnauthorized);
  const deleteUnor = useService(UnorsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: '15%',
      sorter: (a, b) => a.logo.length - b.logo.length,
      searchable: true,
      render: (record) => (
        <div className="flex items-center justify-center">
          <Card className="[&_.ant-card-body]:!p-2">
            <img src={record} className="h-12 w-12 object-cover" loading="lazy" />
          </Card>
        </div>
      )
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Wilayah',
      dataIndex: 'region',
      sorter: (a, b) => a.region.length - b.region.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, UnorModel], [DELETE, UnorModel], [READ, UnorModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.UNOR}`}
            model={UnorModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.UNOR}`,
                data: record,
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateUnor.execute(record.id, { ...values, _method: 'PUT' }, token, values.logo.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUnors({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.UNOR}`}
            model={UnorModel}
            onClick={() => {
              modal.show.description({
                title: record.name,
                data: [
                  {
                    key: 'name',
                    label: `Nama Unor`,
                    children: record.name
                  },
                  {
                    key: 'region',
                    label: `Wilayah`,
                    children: record.region
                  },
                  {
                    key: 'address',
                    label: `Alamat`,
                    children: record.address
                  },
                  {
                    key: 'email',
                    label: `Email`,
                    children: record.email
                  },
                  {
                    key: 'phone_number',
                    label: `Nomor Telp`,
                    children: record.phone_number
                  },

                  {
                    key: 'name',
                    label: `Nama Unor`,
                    children: record.name
                  },
                  {
                    key: 'website',
                    label: `Situs Resmi`,
                    children: (
                      <Button icon={<GlobalOutlined />} onClick={() => window.open(record.website, '_blank')}>
                        Kunjungi
                      </Button>
                    )
                  },
                  {
                    key: 'logo',
                    label: `Nama Unor`,
                    children: <Image src={record.logo} width={50} />
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.UNOR}`}
            model={UnorModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.UNOR}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteUnor.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchUnors({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.UNOR}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeUnor.execute(values, token, values.logo.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchUnors({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllUnors.isLoading}>
        <DataTableHeader model={UnorModel} modul={Modul.UNOR} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={unors} columns={column} loading={getAllUnors.isLoading} map={(unors) => ({ key: unors.id, ...unors })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Unors;
