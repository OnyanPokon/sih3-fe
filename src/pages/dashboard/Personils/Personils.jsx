import { Delete, Detail, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { Personils as PersonilModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields';
import PersonilsService from '@/services/PersonilsService.js';
import UnorsService from '@/services/UnorsService';

const { DELETE, UPDATE, READ } = Action;

const Personils = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllPersonils } = useAbortableService(PersonilsService.getAll, { onUnauthorized });
  const { execute: fetchUnors, ...getAllUnors } = useAbortableService(UnorsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPersonils.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchPersonils = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchPersonils();
    fetchUnors({ token: token });
  }, [fetchPersonils, fetchUnors, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const personils = getAllPersonils.data ?? [];
  const unors = getAllUnors.data ?? [];

  const storePersonil = useService(PersonilsService.store, onUnauthorized);
  const updatePersonil = useService(PersonilsService.update, onUnauthorized);
  const deletePersonil = useService(PersonilsService.delete, onUnauthorized);

  const column = [
    {
      title: 'NIP',
      dataIndex: 'nip',
      sorter: (a, b) => a.nip.length - b.nip.length,
      searchable: true
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Jabatan',
      dataIndex: 'position',
      sorter: (a, b) => a.position.length - b.position.length,
      searchable: true
    },
    {
      title: 'Role',
      dataIndex: ['user_id', 'role'],
      sorter: (a, b) => a.user_id.role.length - b.user_id.role.length,
      searchable: true
    }
  ];
  if (user && user.eitherCan([UPDATE, PersonilModel], [DELETE, PersonilModel], [READ, PersonilModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.PERSONIL}`}
            model={PersonilModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.PERSONIL}`,
                data: { ...record, email: record.user_id.email, unor_id: record.unor_id.id, role: record.user_id.role },
                formFields: formFields({ options: { unors } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePersonil.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPersonils({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Detail
            title={`Detail ${Modul.PERSONIL}`}
            model={PersonilModel}
            onClick={() => {
              modal.show.description({
                title: record.name,
                data: [
                  {
                    key: 'name',
                    label: `Nama Personil`,
                    children: record.name
                  },
                  {
                    key: 'nip',
                    label: `NIP`,
                    children: record.nip
                  },
                  {
                    key: 'position',
                    label: `Jabatan`,
                    children: record.position
                  },
                  {
                    key: 'phone_number',
                    label: `Nomor Telp`,
                    children: record.phone_number
                  },
                  {
                    key: 'status',
                    label: `Status`,
                    children: record.status
                  },
                  {
                    key: 'user_id.role',
                    label: `Role`,
                    children: record.user_id.role
                  },
                  {
                    key: 'unor.name',
                    label: `Nama Unor`,
                    children: record.unor_id.name
                  },
                  {
                    key: 'unor.region',
                    label: `Wilayah Unor`,
                    children: record.unor_id.region
                  },
                  {
                    key: 'unor.address',
                    label: `Alamat Unor`,
                    children: record.unor_id.address
                  }
                ]
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.PERSONIL}`}
            model={PersonilModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.PERSONIL}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePersonil.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPersonils({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.PERSONIL}`,
      formFields: formFields({ options: { unors } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storePersonil.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPersonils({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllPersonils.isLoading}>
        <DataTableHeader model={PersonilModel} modul={Modul.PERSONIL} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={personils} columns={column} loading={getAllPersonils.isLoading} map={(personil) => ({ key: personil.id, ...personil })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Personils;
