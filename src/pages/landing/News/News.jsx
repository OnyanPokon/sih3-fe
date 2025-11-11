import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ArticlesService, NewsService } from '@/services';
import { Card, Empty, Pagination, Skeleton, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import dateFormatterID from '@/utils/dateFormatterId';

const News = () => {
  const navigte = useNavigate();
  const { prefix } = useParams();
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchArticles, ...getAllArticles } = useAbortableService(ArticlesService.getAllInLanding, { onUnauthorized });
  const newsPagination = usePagination({ totalData: getAllNews.totalData });
  const articlePagination = usePagination({ totalData: getAllArticles.totalData });

  React.useEffect(() => {
    fetchNews({ page: newsPagination.page, per_page: newsPagination.perPage, category_slug: prefix });
    fetchArticles({ page: articlePagination.page, per_page: articlePagination.perPage, category_slug: prefix });
  }, [articlePagination.page, articlePagination.perPage, fetchArticles, fetchNews, newsPagination.page, newsPagination.perPage, prefix]);

  const news = getAllNews.data ?? [];
  const articles = getAllArticles.data ?? [];

  const getSectionBg = (prefix) => {
    switch (prefix) {
      case 'hidrologi':
        return "url('/image_asset/background/hidrologi.jpg')";
      case 'hidrometerologi':
        return "url('/image_asset/background/hidrometerologi_bg.jpg')";
      case 'hidrogeologi':
        return "url('/image_asset/background/hidrogeologi.jpg')";
    }
  };

  return (
    <>
      <section
        style={{
          backgroundImage: getSectionBg(prefix),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 py-20 pt-48">
          <div className="w-full">
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              {prefix}
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Berita dan artikel terkait {prefix} terkini</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 pt-24">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-32">
          <div>
            <div className="mt-12 flex w-full items-center justify-center">
              <Typography.Title level={4}>
                Artikel <span className="capitalize">{prefix}</span>
              </Typography.Title>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              {getAllArticles.isLoading ? (
                Array.from({ length: 4 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[280px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              ) : (
                <>
                  {!articles.length && <Empty styles={{ image: { height: 60 } }} description={<Typography.Text>Belum ada artikel {prefix} yang tersedia</Typography.Text>}></Empty>}
                  {articles?.map((item) => (
                    <Card onClick={() => navigte('/article/' + prefix + '/' + item.slug)} key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnails[0].thumbnail} className="h-52 object-cover" />}>
                      <div className="text-gray-500">
                        <Typography.Title level={5}>
                          <span className="news-text">{item.title}</span>
                        </Typography.Title>
                        <p className="news-text mb-4">{parse(item.content)}</p>
                        <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                      </div>
                    </Card>
                  ))}
                </>
              )}
            </div>
            <div className="mt-12 flex w-full items-center justify-center">
              <Pagination current={newsPagination.page} total={newsPagination.totalData} onChange={newsPagination.onChange} pageSize={newsPagination.per_page} />
            </div>
          </div>
          <div className="">
            <div className="mt-12 flex w-full items-center justify-center">
              <Typography.Title level={4}>
                Berita <span className="capitalize">{prefix}</span>
              </Typography.Title>
            </div>
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              {getAllNews.isLoading ? (
                Array.from({ length: 4 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[280px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              ) : (
                <>
                  {!news.length && <Empty styles={{ image: { height: 60 } }} description={<Typography.Text>Belum ada berita {prefix} yang tersedia</Typography.Text>}></Empty>}
                  {news?.map((item) => (
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
                </>
              )}
            </div>
            <div className="mt-12 flex w-full items-center justify-center">
              <Pagination current={newsPagination.page} total={newsPagination.totalData} onChange={newsPagination.onChange} pageSize={newsPagination.per_page} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
