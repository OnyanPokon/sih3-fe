import { useNotification, useService } from '@/hooks';
import { NewsService } from '@/services';
import dateFormatterID from '@/utils/dateFormatterId';
import { SocialMediaShare } from '@/utils/SocialMediaShare';
import { ArrowLeftOutlined, FacebookOutlined, ShareAltOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Skeleton, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReadNews = () => {
  const { slug } = useParams();
  const { error } = useNotification();
  const { execute: fetchNews, ...getAllNews } = useService(NewsService.getBySlug);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchNews({ slug });
  }, [fetchNews, slug]);

  const { data: news, loading } = getAllNews;

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

  const shareData = {
    title: news.title,
    text: news.title,
    url: window.location.href
  };

  const handleShare = async () => {
    try {
      if (window.navigator.share) {
        await window.navigator.share(shareData);
      } else {
        await window.navigator.clipboard.writeText(shareData.url);
        error('Gagal', 'Gagal Membagikan');
      }
    } catch (error) {
      error('Gagal membagikan:', error);
    }
  };

  return (
    <section className="bg-white pb-16 pt-8 antialiased lg:pb-24 lg:pt-28">
      <div className="mx-auto flex max-w-screen-xl justify-center gap-x-16 px-4">
        <div className="flex flex-col items-center gap-y-4">
          <div className="mt-1 flex flex-col items-center gap-y-1">
            <Button shape="circle" size="large" color="danger" variant="outlined" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="text-xs text-red-500">Kembali</span>
          </div>
          <Button className="mt-6" size="middle" icon={<ShareAltOutlined />} shape="circle" color="primary" variant="outlined" onClick={handleShare} />
          <Button
            size="middle"
            icon={<FacebookOutlined />}
            shape="circle"
            color="primary"
            variant="outlined"
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'facebook'
                }),
                '_blank'
              )
            }
          />
          <Button
            size="middle"
            icon={<WhatsAppOutlined />}
            shape="circle"
            color="green"
            variant="outlined"
            onClick={() =>
              window.open(
                SocialMediaShare({
                  currentUrl: window.location.href,
                  text: news.title,
                  media: 'whatsapp'
                }),
                '_blank'
              )
            }
          />
        </div>
        <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert w-full max-w-2xl">
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
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col">
            <Typography.Title level={5} className="w-fit border-b-2 border-blue-500 pb-1">
              Kategori
            </Typography.Title>
            <div className="inline-flex items-center gap-x-2">
              <Card className="[&_.ant-card-body]:!p-2">
                <img src={news.category_id.logo} className="h-8 w-8 object-cover" loading="lazy" />
              </Card>
              <b className="text-sm">{news.category_id.category_name}</b>
            </div>
          </div>
          <div className="flex flex-col">
            <Typography.Title level={5} className="w-fit border-b-2 border-blue-500 pb-1">
              Sumber
            </Typography.Title>
            <div className="flex w-full flex-col items-center gap-x-2">
              <small className="w-full py-2">Unit Organisasi: {news.unor_id.name}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">Wilayah: {news.unor_id.region}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">Email: {news.unor_id.email}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">
                website: <a href={news.unor_id.website}>{news.unor_id.website}</a>{' '}
              </small>
              <Divider style={{ margin: 0 }} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadNews;
