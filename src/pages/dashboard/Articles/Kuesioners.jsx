import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Rate, Skeleton, Space } from 'antd';
import { Kuesioners as KuesionerModel } from '@/models';
import React from 'react';
import { DataTable, DataTableHeader } from '@/components';
import { KuesionersService } from '@/services';
import { useParams } from 'react-router-dom';
import { Action } from '@/constants';
import { Delete } from '@/components/dashboard/button';
import { BASE_URL } from '@/utils/api';

const { DELETE } = Action;

const Articles = () => {
  const modal = useCrudModal();
  const { success, error } = useNotification();
  const params = useParams();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllKuesioners } = useAbortableService(KuesionersService.getAll, { onUnauthorized });

  const deleteKuesioner = useService(KuesionersService.delete);

  const pagination = usePagination({ totalData: getAllKuesioners.totalData });

  const fetchKuesioners = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      artikel_id: params.id_artikel
    });
  }, [execute, pagination.page, pagination.perPage, params.id_artikel, token]);

  React.useEffect(() => {
    fetchKuesioners();
  }, [fetchKuesioners, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const kuesioners = getAllKuesioners.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Instansi',
      dataIndex: 'agency',
      sorter: (a, b) => a.agency.length - b.agency.length,
      searchable: true
    },
    {
      title: 'Asal',
      dataIndex: 'provenence',
      sorter: (a, b) => a.provenence.length - b.provenence.length,
      searchable: true
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating.length - b.rating.length,
      searchable: true,
      render: (record) => <Rate value={record} disabled />
    }
  ];

  if (user && user.eitherCan([DELETE, KuesionerModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Delete
            title={`Delete ${Modul.KUESIONER}`}
            model={KuesionerModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.KUESIONER}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteKuesioner.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchKuesioners({ token: token, page: pagination.page, per_page: pagination.per_page });
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

  const exportFn = async () => {
    fetch(`${BASE_URL}/kuesioner/export?artikel_id=${params.id_artikel}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data_kuesioner.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error('Export failed:', error));
  };

  return (
    <Card>
      <Skeleton loading={getAllKuesioners.isLoading}>
        <DataTableHeader model={KuesionerModel} modul={Modul.KUESIONER} selectedData={selectedData} onExport={exportFn} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={kuesioners} columns={column} loading={getAllKuesioners.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Articles;
