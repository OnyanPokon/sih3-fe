import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { NewsService } from '@/services';
import { Card, Pagination, Skeleton, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import dateFormatterID from '@/utils/dateFormatterId';

const News = () => {
  const navigte = useNavigate();
  const { prefix } = useParams();
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllNews.totalData });

  React.useEffect(() => {
    fetchNews({ page: pagination.page, per_page: pagination.perPage, category_slug: prefix });
  }, [fetchNews, pagination.page, pagination.perPage, prefix]);

  const news = getAllNews.data ?? [];
  return (
    <section className="bg-gray-50 pt-24">
      <div className="mx-auto w-full max-w-screen-xl px-6 pb-32">
        <div className="mt-12 flex w-full items-center justify-center">
          <Typography.Title level={4}>
            Berita <span className="capitalize">{prefix}</span>
          </Typography.Title>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
          {getAllNews.isLoading
            ? Array.from({ length: 4 }, (_, i) => i).map((index) => (
                <Card className="w-full max-w-[280px]" key={index}>
                  <Skeleton active />
                </Card>
              ))
            : news?.map((item) => (
                <Card onClick={() => navigte(window.location.pathname + 'news/' + item.slug)} key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnail} className="h-52 object-cover" />}>
                  <div className="text-gray-500">
                    <Typography.Title level={5}>
                      <span className="news-text">{item.title}</span>
                    </Typography.Title>
                    <p className="news-text mb-4">{parse(item.content)}</p>
                    <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                  </div>
                </Card>
              ))}
        </div>
        <div className="mt-12 flex w-full items-center justify-center">
          <Pagination current={pagination.page} total={pagination.totalData} onChange={pagination.onChange} pageSize={pagination.per_page} />
        </div>
      </div>
    </section>
  );
};

export default News;
