import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { PosTypes as PosTypeModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { PosTypesService, CategoriesService } from '@/services';
import { formFields } from './FormFields.js';
import Action from '@/constants/Action.js';
import Edit from '@/components/dashboard/button/Edit.jsx';
import Delete from '@/components/dashboard/button/Delete.jsx';

const { DELETE, UPDATE, READ } = Action;

const PosTypes = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllPosTypes } = useAbortableService(PosTypesService.getAll, { onUnauthorized });
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPosTypes.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchPosTypes = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchPosTypes();
    fetchCategories({ token: token });
  }, [fetchCategories, fetchPosTypes, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const posTypes = getAllPosTypes.data ?? [];
  const categories = getAllCategories.data ?? [];

  const storePosType = useService(PosTypesService.store, onUnauthorized);
  const updatePosType = useService(PosTypesService.update, onUnauthorized);
  const deletePosType = useService(PosTypesService.delete, onUnauthorized);

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Kategori',
      dataIndex: ['id_kategori', 'category_name'],
      sorter: (a, b) => a.id_kategori.category_name.length - b.id_kategori.category_name.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, PosTypeModel], [DELETE, PosTypeModel], [READ, PosTypeModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.POSTYPES}`}
            model={PosTypeModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.POSTYPES}`,
                data: { ...record, id_kategori: record.id_kategori.id },
                formFields: formFields({ options: { categories: categories } }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updatePosType.execute(record.id, values, token);
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
            title={`Delete ${Modul.POSTYPES}`}
            model={PosTypeModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.POSTYPES}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deletePosType.execute(record.id, token);
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
      title: `Tambah ${Modul.POSTYPES}`,
      formFields: formFields({ options: { categories: categories } }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storePosType.execute(values, token);
        if (isSuccess) {
          success('Berhasil', message);
          fetchPosTypes({ token: token, page: pagination.page, per_page: pagination.per_page });
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllPosTypes.isLoading}>
        <DataTableHeader model={PosTypeModel} modul={Modul.POSTYPES} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={posTypes} columns={column} loading={getAllPosTypes.isLoading} map={(posTypes) => ({ key: posTypes.id, ...posTypes })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default PosTypes;
