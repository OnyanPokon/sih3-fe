import { useService } from '@/hooks';
import { NewsService } from '@/services';
import dateFormatterID from '@/utils/dateFormatterId';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

const Read = () => {
  const { slug } = useParams();
  const { execute: fetchNews, ...getAllNews } = useService(NewsService.getBySlug);

  React.useEffect(() => {
    fetchNews({ slug });
  }, [fetchNews, slug]);

  const { data: news, loading } = getAllNews;

  React.useEffect(() => {
    window.scrollTo({
      top: 10,
      behavior: 'smooth' // agar animasinya halus
    });
  }, []);

  // Skeleton UI
  if (loading || !news) {
    return (
      <section className="bg-white pb-16 pt-8 antialiased lg:pb-24 lg:pt-28">
        <div className="mx-auto flex max-w-screen-xl justify-between px-4">
          <article className="mx-auto w-full max-w-2xl">
            <Skeleton paragraph={{ rows: 4 }} active className="mb-20" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
            <Skeleton paragraph={{ rows: 4 }} active className="mb-4" />
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pb-16 pt-8 antialiased lg:pb-24 lg:pt-28">
      <div className="mx-auto flex max-w-screen-xl justify-between px-4">
        <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full max-w-2xl">
          <div className="not-format mb-4 lg:mb-6">
            <address className="mb-6 flex items-center not-italic">
              <div className="mr-3 inline-flex items-center text-sm text-gray-900">
                <Avatar size={48} icon={<UserOutlined />} className="mr-4" />
                <div>
                  <a href="#" rel="author" className="text-base font-bold text-gray-900">
                    {news?.user_id?.username ?? 'Tanpa Penulis'}
                  </a>
                  <p className="text-xs text-gray-500">{news?.created_at ? dateFormatterID(news.created_at) : '-'}</p>
                </div>
              </div>
            </address>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-14 lg:text-4xl">{news?.title}</h1>
            {news?.thumbnail ? (
              <img src={news.thumbnail} alt={news.title} className="aspect-video w-full rounded-lg object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">Tidak ada gambar</div>
            )}
          </div>

          <div className="prose prose-lg text-justify leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: news?.content }} />
        </article>
      </div>
    </section>
  );
};

export default Read;
