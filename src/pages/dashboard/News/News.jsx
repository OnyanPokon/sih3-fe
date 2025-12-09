import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Card, Skeleton, Space } from 'antd';
import { News as NewsModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import NewsService from '@/services/NewsService.js';
import { useNavigate } from 'react-router-dom';

const { DELETE, UPDATE } = Action;

const News = () => {
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const { token, user, onUnauthorized } = useAuth();
  const { execute, ...getAllNews } = useAbortableService(NewsService.getAll, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllNews.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchNews = React.useCallback(() => {
    execute({
      token: token,
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage, token]);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews, token]);

  const [selectedData, setSelectedData] = React.useState([]);

  const news = getAllNews.data ?? [];

  const deleteCategory = useService(NewsService.delete, onUnauthorized);

  const column = [
    {
      title: 'Judul',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.length - b.status.length,
      searchable: true
    }
  ];

  if (user && user.eitherCan([UPDATE, NewsModel], [DELETE, NewsModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.NEWS}`}
            model={NewsModel}
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.slug);
            }}
          />
          <Delete
            title={`Delete ${Modul.NEWS}`}
            model={NewsModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.NEWS}`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteCategory.execute(record.id, token);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchNews({ token: token, page: pagination.page, per_page: pagination.per_page });
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
    navigate(window.location.pathname + '/create');
  };

  return (
    <Card>
      <Skeleton loading={getAllNews.isLoading}>
        <DataTableHeader model={NewsModel} modul={Modul.NEWS} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={news} columns={column} loading={getAllNews.isLoading} map={(news) => ({ key: news.id, ...news })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default News;
