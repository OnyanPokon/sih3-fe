import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { Categories as CategoryModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { formFields } from './FormFields.js';
import CategoriesService from '@/services/CategoriesService.js';

const { DELETE, UPDATE, READ } = Action;

const Categories = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllCategories.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchCategories = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const categories = getAllCategories.data ?? [];

  const storeCategory = useService(CategoriesService.store, onUnauthorized);
  const updateCategory = useService(CategoriesService.update, onUnauthorized);
  const deleteCategory = useService(CategoriesService.delete, onUnauthorized);

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
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.length - b.category_name.length,
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'desc',
      sorter: (a, b) => a.desc.length - b.desc.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, CategoryModel], [DELETE, CategoryModel], [READ, CategoryModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.CATEGORY}`}
            model={CategoryModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.CATEGORY}`,
                data: record,
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateCategory.execute(record.id, { ...values, _method: 'PUT' }, token, values.logo.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategories({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.CATEGORY}`}
            model={CategoryModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.CATEGORY}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCategory.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchCategories({ token: token, page: pagination.page, per_page: pagination.per_page });
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
      title: `Tambah ${Modul.CATEGORY}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeCategory.execute(values, token, values.logo.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchCategories({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllCategories.isLoading}>
        <DataTableHeader model={CategoryModel} modul={Modul.CATEGORY} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={categories} columns={column} loading={getAllCategories.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Categories;
