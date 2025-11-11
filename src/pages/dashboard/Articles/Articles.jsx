import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Skeleton, Space, Tooltip } from 'antd';
import { Categories as CategoryModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { DatabaseOutlined } from '@ant-design/icons';
import { ArticlesService } from '@/services';
import { useNavigate } from 'react-router-dom';

const { DELETE, UPDATE, READ } = Action;

const Articles = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllArticles } = useAbortableService(ArticlesService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllArticles.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchArticles = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const articles = getAllArticles.data ?? [];

  const deleteCategory = useService(ArticlesService.delete, onUnauthorized);

  const column = [
    {
      title: 'Judul Artikel',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
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
              console.log('haha');
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
                    fetchArticles({ token: token, page: pagination.page, per_page: pagination.per_page });
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
          <Tooltip title="Dataset">
            <Button icon={<DatabaseOutlined />} variant="outlined" color="primary" />
          </Tooltip>
        </Space>
      )
    });
  }

  const onCreate = () => {
    navigate(window.location.pathname);
  };

  return (
    <Card>
      <Skeleton loading={getAllArticles.isLoading}>
        <DataTableHeader model={CategoryModel} modul={Modul.CATEGORY} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={articles} columns={column} loading={getAllArticles.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Articles;
