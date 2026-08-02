import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Skeleton, Space, Tag } from 'antd';
import { Roles as RoleModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import RolesService from '@/services/RolesService.js';
import { DeleteOutlined, EditOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { formFields } from './FormFields.js';
import ManagePermissionsService from '@/services/ManagePermissionsService.js';

const Roles = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllRoles } = useAbortableService(RolesService.getAll, { onUnauthorized });
  const { execute: fetchPermissions, ...getAllPermissions } = useAbortableService(ManagePermissionsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllRoles.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchRoles = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchRoles();
    fetchPermissions({ token: token, page: 1, per_page: 9999 });
  }, [fetchPermissions, fetchRoles, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const roles = getAllRoles.data ?? [];
  const permissions = getAllPermissions.data ?? [];

  const storeRole = useService(RolesService.store, onUnauthorized);
  const updateRole = useService(RolesService.update, onUnauthorized);
  const deleteRole = useService(RolesService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Nama',
      dataIndex: 'permissions',
      sorter: (a, b) => a.permissions.length - b.permissions.length,
      searchable: true,
      render: (record) => <div className="flex flex-wrap items-center gap-y-2">{record.length > 0 ? record.map((item) => <Tag key={item}>{item}</Tag>) : <Tag icon={<WarningOutlined className="text-yellow-500" />}>Tidak ada</Tag>}</div>
    }
  ];

  if (user) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            variant="outlined"
            color="primary"
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.ROLE}`,
                data: record,
                formFields: formFields({ options: { permissions } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateRole.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRoles({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            variant="outlined"
            color="danger"
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ROLE}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteRole.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchRoles({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.ROLE}`,
      formFields: formFields({ options: { permissions } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeRole.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchRoles({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        <DataTableHeader model={RoleModel} modul={Modul.ROLE} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
      }
    >
      <Skeleton loading={getAllRoles.isLoading}>

        <div className="flex w-full items-center justify-end">
          <Button type="primary" className="mb-4" icon={<PlusOutlined />} onClick={onCreate}>
            Tambah
          </Button>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={roles} columns={column} loading={getAllRoles.isLoading} map={(role) => ({ key: role.id, ...role })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Roles;
