import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { WilayahSungai as WilayahSungaiModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { WilayahSungaiService, CategoriesService } from '@/services';
import { formFields } from './FormFields.js';
import Action from '@/constants/Action.js';
import Edit from '@/components/dashboard/button/Edit.jsx';
import Delete from '@/components/dashboard/button/Delete.jsx';

const { DELETE, UPDATE, READ } = Action;

const WilayahSungai = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllWilayahSungai } = useAbortableService(WilayahSungaiService.getAll, { onUnauthorized });
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllWilayahSungai.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchWilayahSungai = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchWilayahSungai();
    if (user?.unor?.id) {
      fetchCategories({ token: token, unor_id: user.unor.id, per_page: 9999 });
    }
  }, [fetchCategories, fetchWilayahSungai, token, user?.unor?.id]);

  const [selectedData, setSelectedData] = React.useState([]);

  const wilayahSungaiList = getAllWilayahSungai.data ?? [];
  const categories = getAllCategories.data ?? [];

  const storeWilayahSungai = useService(WilayahSungaiService.store, onUnauthorized);
  const updateWilayahSungai = useService(WilayahSungaiService.update, onUnauthorized);
  const deleteWilayahSungai = useService(WilayahSungaiService.delete, onUnauthorized);

  const column = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      width: '10%',
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
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchable: true
    },
    {
      title: 'Kategori',
      dataIndex: ['category', 'category_name'],
      sorter: (a, b) => (a.category?.category_name || '').localeCompare(b.category?.category_name || ''),
      searchable: true
    },
    {
      title: 'Kewenangan',
      dataIndex: 'kewenangan',
      sorter: (a, b) => a.kewenangan.localeCompare(b.kewenangan),
      searchable: true
    },
    {
      title: 'Luas Wilayah',
      dataIndex: 'luas_wilayah',
      sorter: (a, b) => a.luas_wilayah.localeCompare(b.luas_wilayah),
      searchable: true
    },
    {
      title: 'Total Titik Pantau',
      dataIndex: 'total_titik_pantau',
      sorter: (a, b) => a.total_titik_pantau - b.total_titik_pantau,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, WilayahSungaiModel], [DELETE, WilayahSungaiModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.WILAYAH_SUNGAI}`}
            model={WilayahSungaiModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.WILAYAH_SUNGAI}`,
                data: { ...record, kategori_id: record.kategori_id },
                formFields: formFields({ categories }),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateWilayahSungai.execute(record.id, { ...values, _method: 'PUT' }, token, values.thumbnail?.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchWilayahSungai();
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.WILAYAH_SUNGAI}`}
            model={WilayahSungaiModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.WILAYAH_SUNGAI}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteWilayahSungai.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchWilayahSungai();
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
      title: `Tambah ${Modul.WILAYAH_SUNGAI}`,
      formFields: formFields({ categories }),
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeWilayahSungai.execute(values, token, values.thumbnail?.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchWilayahSungai();
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllWilayahSungai.isLoading}>
        <DataTableHeader model={WilayahSungaiModel} modul={Modul.WILAYAH_SUNGAI} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={wilayahSungaiList} columns={column} loading={getAllWilayahSungai.isLoading} map={(item) => ({ key: item.id, ...item })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default WilayahSungai;
