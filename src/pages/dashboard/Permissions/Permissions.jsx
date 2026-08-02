import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Skeleton, Space } from 'antd';
import { Permission as PermissionModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields.js';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ManagePermissionsService from '@/services/ManagePermissionsService.js';

const Permissions = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllPermissions } = useAbortableService(ManagePermissionsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPermissions.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchPermissions = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const permissions = getAllPermissions.data ?? [];

  const storePermission = useService(ManagePermissionsService.store, onUnauthorized);
  const updatePermission = useService(ManagePermissionsService.update, onUnauthorized);
  const deletePermission = useService(ManagePermissionsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
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
                title: `Edit ${Modul.PERMISSION}`,
                data: record,
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePermission.execute(record.id, values, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPermissions({ token: token, page: pagination.page, per_page: pagination.per_page });
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
                title: `Delete ${Modul.PERMISSION}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePermission.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchPermissions({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.PERMISSION}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storePermission.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPermissions({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        <DataTableHeader model={PermissionModel} modul={Modul.PERMISSION} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
      }
    >
      <Skeleton loading={getAllPermissions.isLoading}>
        <div className="flex w-full items-center justify-end">
          <Button type="primary" className="mb-4" icon={<PlusOutlined />} onClick={onCreate}>
            Tambah
          </Button>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={permissions}
            columns={column}
            loading={getAllPermissions.isLoading}
            map={(permission) => ({ key: permission.id, ...permission })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Permissions;
