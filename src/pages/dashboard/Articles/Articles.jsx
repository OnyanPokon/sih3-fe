import { Delete, Edit } from '@/components/dashboard/button';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, usePagination, useService } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { Button, Card, Skeleton, Space, Tooltip } from 'antd';
import { Articles as ArticleModel } from '@/models';
import React from 'react';
import { Action } from '@/constants';
import { DataTable, DataTableHeader } from '@/components';
import { CheckSquareOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
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
      title: 'Dengan Kuisioner',
      dataIndex: 'additional_quiz',
      sorter: (a, b) => a.additional_quiz.length - b.additional_quiz.length,
      searchable: true,
      render: (record) => (record ? 'Dengan Kuis' : 'Tanpa Kuis')
    }
  ];

  if (user && user.eitherCan([UPDATE, ArticleModel], [DELETE, ArticleModel], [READ, ArticleModel])) {
    column.push({
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Edit
            title={`Edit ${Modul.ARTICLE}`}
            model={ArticleModel}
            onClick={() => {
              navigate(window.location.pathname + '/edit/' + record.slug);
            }}
          />
          <Delete
            title={`Delete ${Modul.ARTICLE}`}
            model={ArticleModel}
            onClick={() => {
              modal.delete.default({
                title: `Delete ${Modul.ARTICLE}`,
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
          {record.additional_quiz === 1 && (
            <Tooltip title="Kuesioner Artikel">
              <Button icon={<CheckSquareOutlined />} variant="outlined" color="primary" onClick={() => navigate(window.location.pathname + '/kuesioners/' + record.id)} />
            </Tooltip>
          )}
        </Space>
      )
    });
  }

  const onNavigate = (data) => {
    navigate(window.location.pathname + '/create', { state: { withQuiz: data } });
  };

  const onCreate = () => {
    modal.show.paragraph({
      data: {
        content: (
          <div className="mt-4 flex h-full items-center justify-center gap-x-6">
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onNavigate(true);
                modal.close();
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <UserAddOutlined className="mb-2 text-3xl" />
                <span className="text-center text-sm font-semibold">Dengan Kuisioner</span>
                <small className="text-center text-gray-500">Akses dokumen artikel dengan mengisi kuisioner tambahan.</small>
              </div>
            </Card>
            <Card
              className="h-full w-full"
              hoverable
              onClick={() => {
                onNavigate(false);
                modal.close();
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-y-2">
                <UserDeleteOutlined className="mb-2 text-3xl" />
                <span className="text-center text-sm font-semibold">Tanpa Kuisioner</span>
                <small className="text-center text-gray-500">Akses dokumen artikel bebas tanpa batasan .</small>
              </div>
            </Card>
          </div>
        )
      }
    });
  };

  return (
    <Card>
      <Skeleton loading={getAllArticles.isLoading}>
        <DataTableHeader model={ArticleModel} modul={Modul.ARTICLE} onStore={onCreate} selectedData={selectedData} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
        <div className="w-full max-w-full overflow-x-auto">
          <DataTable data={articles} columns={column} loading={getAllArticles.isLoading} map={(category) => ({ key: category.id, ...category })} handleSelectedData={(_, selectedRows) => setSelectedData(selectedRows)} pagination={pagination} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default Articles;
