import { InputType } from '@/constants';
import { useCrudModal, useNotification, useService } from '@/hooks';
import { ArticlesService, KuesionersService } from '@/services';
import dateFormatterID from '@/utils/dateFormatterId';
import { ArrowLeftOutlined, DownloadOutlined, FacebookOutlined, FileOutlined, ShareAltOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Carousel, Divider, List, Skeleton, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReadArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { error } = useNotification();
  const { execute: fetchArticles, ...getAllArticles } = useService(ArticlesService.getBySlug);

  const storeKuesioner = useService(KuesionersService.store);

  React.useEffect(() => {
    fetchArticles({ slug });
  }, [fetchArticles, slug]);

  const { data: articles, loading } = getAllArticles;

  if (loading || !articles) {
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

  const onAdditionalQuizTrue = (doc_url) => {
    modal.create({
      title: `Kuisioner Kepuasan`,
      formFields: [
        {
          label: `Nama Lengkap`,
          name: 'name',
          type: InputType.TEXT,
          rules: [
            {
              required: true,
              message: `Nama Lengkap harus diisi`
            }
          ]
        },
        {
          label: `Instansi`,
          name: 'agency',
          type: InputType.TEXT,
          rules: [
            {
              required: true,
              message: `Instansi harus diisi`
            }
          ]
        },
        {
          label: `Asal`,
          name: 'provenance',
          type: InputType.TEXT,
          rules: [
            {
              required: true,
              message: `Asal harus diisi`
            }
          ]
        },
        {
          label: `Deskripsi penilaian`,
          name: 'desc',
          type: InputType.LONGTEXT,
          rules: [
            {
              required: true,
              message: `Deskripsi penilaian harus diisi`
            }
          ]
        },
        {
          label: `Nilai/Rating`,
          name: 'rating',
          type: InputType.RATING,
          rules: [
            {
              required: true,
              message: `Nilai/Rating harus diisi`
            }
          ]
        }
      ],
      onSubmit: async (values) => {
        const { message, isSuccess } = await storeKuesioner.execute({ ...values, id_article: articles.id });
        if (isSuccess) {
          window.open(doc_url, '_blank');
        } else {
          error('Gagal', message);
        }
        return isSuccess;
      }
    });
  };

  return (
    <section className="bg-white pb-16 pt-8 antialiased lg:pb-24 lg:pt-28">
      <div className="mx-auto flex max-w-screen-xl justify-center gap-x-16 px-4">
        <div className="flex flex-col items-center gap-y-4">
          <div className="mt-1 flex flex-col items-center gap-y-1">
            <Button shape="circle" size="large" color="danger" variant="outlined" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="text-xs text-red-500">Kembali</span>
          </div>
          <Button className="mt-6" size="middle" icon={<ShareAltOutlined />} shape="circle" color="primary" variant="outlined" />
          <Button size="middle" icon={<FacebookOutlined />} shape="circle" color="primary" variant="outlined" />
          <Button size="middle" icon={<WhatsAppOutlined />} shape="circle" color="green" variant="outlined" />
        </div>
        <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert w-full max-w-2xl">
          <div className="not-format mb-4 lg:mb-6">
            <address className="mb-6 flex items-center not-italic">
              <div className="mr-3 inline-flex items-center text-sm text-gray-900">
                <Avatar size={48} icon={<UserOutlined />} className="mr-4" />
                <div>
                  <a href="#" rel="author" className="text-base font-bold text-gray-900">
                    {articles?.user_id?.username ?? 'Tanpa Penulis'}
                  </a>
                  <p className="text-xs text-gray-500">{articles?.created_at ? dateFormatterID(articles.created_at) : '-'}</p>
                </div>
              </div>
            </address>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-14 lg:text-4xl">{articles?.title}</h1>
            {articles?.thumbnails ? (
              <Carousel className="w-full" autoplay={{ dotDuration: true }} autoplaySpeed={1000} arrows>
                {articles.thumbnails.map((item) => (
                  <div className="w-full" key={item.id}>
                    <img src={item.thumbnail} className="aspect-video w-full object-cover" />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">Tidak ada gambar</div>
            )}
          </div>

          <div className="prose prose-lg mb-6 text-justify leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: articles?.content }} />
          <div>
            <Typography.Title level={4}>Dokumen terkait</Typography.Title>
            <List
              itemLayout="horizontal"
              dataSource={articles.doc}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      shape="circle"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        if (articles.additional_quiz) {
                          onAdditionalQuizTrue(item.doc);
                        } else {
                          window.open(item.doc, '_blank');
                        }
                      }}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50">
                        <FileOutlined className="text-blue-500" />
                      </div>
                    }
                    title={<span className="news-text">{item.doc}</span>}
                  />
                </List.Item>
              )}
            />
          </div>
        </article>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col">
            <Typography.Title level={5} className="w-fit border-b-2 border-blue-500 pb-1">
              Kategori
            </Typography.Title>
            <div className="inline-flex items-center gap-x-2">
              <Card className="[&_.ant-card-body]:!p-2">
                <img src={articles.category_id.logo} className="h-8 w-8 object-cover" loading="lazy" />
              </Card>
              <b className="text-sm">{articles.category_id.category_name}</b>
            </div>
          </div>
          <div className="flex flex-col">
            <Typography.Title level={5} className="w-fit border-b-2 border-blue-500 pb-1">
              Sumber
            </Typography.Title>
            <div className="flex w-full flex-col items-center gap-x-2">
              <small className="w-full py-2">Unit Organisasi: {articles.unor_id.name}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">Wilayah: {articles.unor_id.region}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">Email: {articles.unor_id.email}</small>
              <Divider style={{ margin: 0 }} className="w-full" />
              <small className="w-full py-2">
                website: <a href={articles.unor_id.website}>{articles.unor_id.website}</a>{' '}
              </small>
              <Divider style={{ margin: 0 }} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadArticle;
