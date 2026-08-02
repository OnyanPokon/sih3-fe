import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Skeleton, Space, Tooltip } from 'antd';
import { LegalProducts as LegalProductModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { LegalProductsService } from '@/services';
import { DownloadOutlined } from '@ant-design/icons';
import { formFields } from './FormFields.js';
import dateFormatter from '@/utils/dateFormatter.js';
import dayjs from 'dayjs';

const { DELETE, UPDATE, READ } = Action;

const LegalProducts = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllLegalProducts } = useAbortableService(LegalProductsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllLegalProducts.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchLegalProducts = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchLegalProducts();
  }, [fetchLegalProducts, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const legalProducts = getAllLegalProducts.data ?? [];

  const storeLegalProduct = useService(LegalProductsService.store, onUnauthorized);
  const updateLegalProduct = useService(LegalProductsService.update, onUnauthorized);
  const deleteLegalProduct = useService(LegalProductsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Judul Produk Hukum',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'desc',
      sorter: (a, b) => a.desc.length - b.desc.length,
      searchable: true
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
      sorter: (a, b) => a.year.length - b.year.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true
    },
    {
      title: 'Nama Unor',
      dataIndex: ['unor_id', 'name'],
      sorter: (a, b) => a.unor_id.name.length - b.unor_id.name.length,
      searchable: true
    },
    {
      title: 'Nama User',
      dataIndex: ['user_id', 'username'],
      sorter: (a, b) => a.unor.username.length - b.unor.username.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, LegalProductModel], [DELETE, LegalProductModel], [READ, LegalProductModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.LEGAL_PRODUCTS}`}
            model={LegalProductModel}
            onClick={() => {
              modal.edit({
                title: `Edit ${Modul.LEGAL_PRODUCTS}`,
                data: { ...record, year: dayjs(record.year) },
                formFields: formFields(),
                onSubmit: async (values) => {
                  const { message, isSuccess } = await updateLegalProduct.execute(record.id, { ...values, _method: 'PUT', year: dateFormatter(values.year, 'year') }, token, values.file.file);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Delete
            title={`Delete ${Modul.LEGAL_PRODUCTS}`}
            model={LegalProductModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.LEGAL_PRODUCTS}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteLegalProduct.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Tooltip title="Unduh Produk Hukum">
            <Button icon={<DownloadOutlined />} variant="outlined" onClick={() => window.open(record.file, '_blank')} />
          </Tooltip>
        </Space>
      )
    });
  }

  const onCreate = () => {
    modal.create({
      title: `Tambah ${Modul.LEGAL_PRODUCTS}`,
      formFields: formFields,
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeLegalProduct.execute({ ...values, year: dateFormatter(values.year, 'year') }, token, values.file.file);
        if (isSuccess) {
          success('Berhasil', message);
          fetchLegalProducts({ token: token, page: pagination.page, per_page: pagination.per_page });
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
        <DataTableHeader model={LegalProductModel} modul={Modul.LEGAL_PRODUCTS} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
      }
    >
      <Skeleton loading={getAllLegalProducts.isLoading}>

        <div className="w-full max-w-full overflow-x-auto">
          <DataTable
            data={legalProducts}
            columns={column}
            loading={getAllLegalProducts.isLoading}
            map={(category) => ({ key: category.id, ...category })}
            handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)}
            pagination={pagination}
          />
        </div>
      </Skeleton>
    </Card>
  );
};

export default LegalProducts;
