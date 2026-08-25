import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ArticlesService, NewsService, TagsService, UnorsService } from '@/services';
import { Button, Card, Empty, Form, Input, Pagination, Select, Skeleton, Typography } from 'antd';
import { Newspaper, Settings } from 'lucide-react';
import * as AntIcons from '@ant-design/icons';
import React from 'react';
import parse from 'html-react-parser';
import dateFormatterID from '@/utils/dateFormatterId';
import { useNavigate } from 'react-router-dom';

const isHexColor = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value || '');

const Portal = () => {
  const { onUnauthorized } = useAuth();
  const [filterForm] = Form.useForm();
  const publicationSectionRef = React.useRef(null);
  const navigate = useNavigate();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchArticles, ...getAllArticles } = useAbortableService(ArticlesService.getAllInLanding, { onUnauthorized });
  const { execute: fetchTags, ...getAllTags } = useAbortableService(TagsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchUnors, ...getAllUnors } = useAbortableService(UnorsService.getAllInLanding, { onUnauthorized });
  const [filterValues, setFilterValues] = React.useState({ search: '', tag_id: '' });
  const newsPagination = usePagination({ totalData: getAllNews.totalData });
  const articlePagination = usePagination({ totalData: getAllArticles.totalData });

  React.useEffect(() => {
    fetchTags({
      page: 1,
      per_page: 999,
      category_slug: 'hidrometerologi'
    });
    fetchUnors({
      page: 1,
      per_page: 999,
      category_slug: 'hidrometerologi'
    });
  }, [fetchTags, fetchUnors]);

  React.useEffect(() => {
    fetchNews({
      page: newsPagination.page,
      per_page: newsPagination.perPage,
      search: filterValues.search,
      wilayah_sungai_id: filterValues.wilayah_sungai_id,
      tag_id: filterValues.tag_id,
      category_slug: 'hidrometeorologi'
    });

    fetchArticles({
      page: articlePagination.page,
      per_page: articlePagination.perPage,
      category_slug: 'hidrometeorologi',
      search: filterValues.search,
      wilayah_sungai_id: filterValues.wilayah_sungai_id,
      tag_id: filterValues.tag_id
    });
  }, [fetchNews, fetchArticles, newsPagination.page, newsPagination.perPage, filterValues.search, filterValues.wilayah_sungai_id, filterValues.tag_id, articlePagination.page, articlePagination.perPage]);

  const newsList = getAllNews.data ?? [];
  const articlesList = getAllArticles.data ?? [];
  const tagsList = getAllTags.data ?? [];
  const unorList = getAllUnors.data ?? [];

  const onSubmitFilter = (values) => {
    const nextValues = {
      search: values.judul?.trim() ?? '',
      wilayah_sungai_id: values.wilayah_sungai ?? '',
      tag_id: values.tags ?? ''
    };

    setFilterValues(nextValues);
    filterForm.setFieldsValue({
      judul: nextValues.search,
      wilayah_sungai: nextValues.wilayah_sungai_id,
      tags: nextValues.tag_id
    });
    publicationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyPublicationFilter = (fieldName, fieldValue) => {
    const currentValues = filterForm.getFieldsValue();
    const nextValues = {
      search: currentValues.judul?.trim() ?? filterValues.search,
      tag_id: filterValues.tag_id
    };

    if (fieldName === 'tag_id') {
      nextValues.tag_id = fieldValue ?? '';
    }

    setFilterValues(nextValues);
    filterForm.setFieldsValue({
      judul: nextValues.search,
      tags: nextValues.tag_id
    });
    newsPagination.onChange(1, newsPagination.perPage);
    publicationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="bg-gradient-to-t from-green-600 to-green-400">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-center gap-x-40 px-12 py-24">
          <div className="flex w-full flex-col gap-y-6">
            <div className="inline-flex items-center gap-x-2">
              {unorList.map((item) => (
                <Card key={item.id} className="[&_.ant-card-body]:!p-2">
                  <img src={item.logo} className="h-12 w-12 object-cover" loading="lazy" />
                </Card>
              ))}
            </div>
            <Typography.Title style={{ margin: 0, color: 'white' }} level={2}>
              Portal Data Publikasi Hidrometeorologi
            </Typography.Title>
            <p className="max-w-sm text-sm text-white">Sistem Pemantauan Cuaca dan Iklim Terpadu untuk Kesiapsiagaan Bencana dan Ketahanan Pangan di Provinsi Gorontalo.</p>
            <div className="grid w-full grid-cols-4 gap-4">
              <div className="col-span-2 flex gap-3 rounded-md bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Newspaper size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="break-all text-sm text-gray-600">Berita</span>
                  <p className="text-sm font-semibold text-gray-900">{newsPagination.totalData}</p>
                </div>
              </div>
              <div className="col-span-2 flex gap-3 rounded-md bg-white p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Settings size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="break-all text-sm text-gray-600">Info Teknis</span>
                  <p className="text-sm font-semibold text-gray-900">{articlePagination.totalData}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-4">
            <img src="/image_asset/illustration/inthought_undraw.png" className="" />
          </div>
        </div>
      </section>
      {tagsList.length > 0 && (
        <section className="bg-gray-100">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-12 py-12">
            <div className="flex w-full flex-col items-center justify-center">
              <Typography.Title level={3}>Topik Portal Hidrometeorologi</Typography.Title>
              <p className="text-center">Data yang dikumpulkan dari beberapa topik terkait kajian hidrometeorologi</p>
            </div>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {getAllTags.isLoading
                ? Array.from({ length: 4 }, (_, i) => i).map((index) => (
                    <Card className="w-full" key={index}>
                      <Skeleton active />
                    </Card>
                  ))
                : tagsList?.map((item) => {
                    const IconComp = AntIcons[item.icon] || AntIcons.TagFilled;
                    const primaryColor = isHexColor(item.color) ? item.color : '#3b82f6';

                    return (
                      <div
                        key={item.id}
                        onClick={() => applyPublicationFilter('tag_id', item.id)}
                        role="button"
                        tabIndex={0}
                        className="flex w-full cursor-pointer flex-col gap-y-2 rounded-lg border-l-2 bg-white p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
                        style={{ borderLeftColor: primaryColor }}
                      >
                        <div className="mb-3 inline-flex items-center justify-between">
                          <IconComp className="transition-transform duration-300 group-hover:scale-110" style={{ color: primaryColor, fontSize: 24 }} />
                        </div>

                        <p className="text-sm font-bold transition-colors duration-300">{item.name}</p>

                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    );
                  })}
            </div>
          </div>
        </section>
      )}
      <section className="bg-gray-50">
        <div ref={publicationSectionRef} className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-6 px-12 py-12">
          <div className="flex w-full flex-col">
            <Typography.Title level={3}>Informasi dan Publikasi</Typography.Title>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <Card title="Filter Data Publikasi" className="col-span-4 h-fit">
              <Form
                form={filterForm}
                layout="vertical"
                onFinish={onSubmitFilter}
                initialValues={{
                  judul: filterValues.search,
                  wilayah_sungai: filterValues.wilayah_sungai_id,
                  tags: filterValues.tag_id
                }}
              >
                <Form.Item label="Judul Publikasi" name="judul" className="mb-2">
                  <Input placeholder="Cari judul publikasi" size="large" />
                </Form.Item>

                <Form.Item label="Topik/Tag" name="tags" className="mb-2">
                  <Select placeholder="Cari berdasarkan topik/tag" size="large" allowClear>
                    <Select.Option value="">Pilih</Select.Option>
                    {tagsList?.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item className="mt-6">
                  <Button block variant="solid" color="green" htmlType="submit" size="large" loading={getAllArticles.isLoading || getAllNews.isLoading}>
                    Tampilkan
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <div className="col-span-8 flex w-full flex-col gap-y-2">
              {newsList.length > 0 && (
                <>
                  <div className="flex w-full flex-col border-b-2 border-blue-500 pb-2">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Publikasi Berita
                    </Typography.Title>
                    <p className="text-sm text-gray-500">
                      Menampilkan {Math.min(newsPagination.page * newsPagination.perPage, newsPagination.totalData || 0)} dari {newsPagination.totalData || 0} data
                    </p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-4 py-2">
                    {getAllArticles.isLoading || getAllNews.isLoading ? (
                      Array.from({ length: 4 }, (_, i) => i).map((index) => (
                        <Card className="w-full max-w-[244px]" key={index}>
                          <Skeleton active />
                        </Card>
                      ))
                    ) : (
                      <>
                        {newsList?.map((item) => (
                          <Card
                            size=""
                            onClick={() => navigate('/portal/news/hidrologi/' + item.slug)}
                            key={item.id}
                            hoverable
                            className="h-full w-full max-w-[244px]"
                            cover={<img src={item.thumbnails?.[0]?.thumbnail ?? item.thumbnail} className="h-36 object-cover" />}
                          >
                            <div className="text-gray-500">
                              <span className={`rounded bg-blue-100 px-2 py-1 text-xs font-semibold capitalize text-blue-800`}>Berita</span>
                              <Typography.Title level={5} className="mt-2">
                                <span className="news-text">{item.title}</span>
                              </Typography.Title>
                              <div className="news-text mb-4">{parse(item.content)}</div>
                              <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                            </div>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                  <Pagination className="mb-8" current={newsPagination.page} pageSize={newsPagination.perPage} total={newsPagination.totalData} onChange={newsPagination.onChange} />
                </>
              )}
              {articlesList.length > 0 && (
                <>
                  <div className="flex w-full flex-col border-b-2 border-blue-500 pb-2">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Publikasi Informasi Teknis
                    </Typography.Title>
                    <p className="text-sm text-gray-500">
                      Menampilkan {Math.min(articlePagination.page * articlePagination.perPage, articlePagination.totalData || 0)} dari {articlePagination.totalData || 0} data
                    </p>
                  </div>
                  <div className="col-span-8 mb-4 flex flex-wrap gap-4 py-2">
                    {getAllArticles.isLoading || getAllNews.isLoading ? (
                      Array.from({ length: 4 }, (_, i) => i).map((index) => (
                        <Card className="w-full max-w-[244px]" key={index}>
                          <Skeleton active />
                        </Card>
                      ))
                    ) : (
                      <>
                        {articlesList?.map((item) => (
                          <Card
                            size="small"
                            onClick={() => navigate('/portal/article/hidrologi/' + item.slug)}
                            key={item.id}
                            hoverable
                            className="h-fit w-full max-w-[244px]"
                            cover={<img src={item.thumbnails?.[0]?.thumbnail ?? item.thumbnail} className="h-36 object-cover" />}
                          >
                            <div className="text-gray-500">
                              <span className={`rounded bg-green-100 px-2 py-1 text-xs font-semibold capitalize text-green-800`}>Informasi Teknis</span>
                              <Typography.Title level={5} className="mt-2">
                                <span className="news-text">{item.title}</span>
                              </Typography.Title>
                              <div className="news-text mb-4">{parse(item.content)}</div>
                              <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                            </div>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                  <Pagination className="mb-8" current={articlePagination.page} pageSize={articlePagination.perPage} total={articlePagination.totalData} onChange={articlePagination.onChange} />
                </>
              )}

              {!articlesList.length && !newsList.length && (
                <div className="col-span-8 flex justify-center py-6">
                  <Empty description="Belum ada data publikasi atau data publikasi dengan filter yang dipilih belum tersedia" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portal;
