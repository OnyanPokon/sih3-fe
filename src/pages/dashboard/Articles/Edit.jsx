/* eslint-disable no-unused-vars */
import { DataLoader, DataTable } from '@/components';
import { Button, Card, Form, Input, Select, Skeleton, Tabs, Typography } from 'antd';
import Modul from '@/constants/Modul';
import { useAuth, useCrudModal, useNotification, useService } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ArticlesService, CategoriesService, TagsService } from '@/services';
import useAbortableService from '@/hooks/useAbortableService';
import { docsColumn, thumbnailsColumn } from './Columns';
import { PlusOutlined } from '@ant-design/icons';
import { InputType } from '@/constants';

const Edit = () => {
  const { token, onUnauthorized } = useAuth();
  const modal = useCrudModal();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [form] = Form.useForm();
  const { success, error } = useNotification();

  const { execute: fetchArticles, ...getAllArticles } = useService(ArticlesService.getBySlug);
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });
  const { execute: fetchTags, ...getAllTags } = useAbortableService(TagsService.getAll, { onUnauthorized });
  const { execute: fetchThumbnails, ...getAllThumbnails } = useService(ArticlesService.getAllThumbnails);
  const { execute: fetchDocs, ...getAllDocs } = useService(ArticlesService.getAllDocs);

  const updateArticle = useService(ArticlesService.update);
  const storeThumbnail = useService(ArticlesService.storeThumbnails);
  const deleteThumbnail = useService(ArticlesService.deleteThumbnails);
  const storeDoc = useService(ArticlesService.storeDoc);
  const deleteDoc = useService(ArticlesService.deleteDocs);

  // Fetch articles, categories, and tags
  useEffect(() => {
    fetchArticles({ slug, token });
    fetchCategories({ token, per_page: 'all' });
    fetchTags({ token, per_page: 'all' });
  }, [fetchArticles, fetchCategories, fetchTags, slug, token]);

  const categories = useMemo(() => getAllCategories.data ?? [], [getAllCategories.data]);
  const tags = useMemo(() => getAllTags.data ?? [], [getAllTags.data]);

  const initialData = useMemo(() => {
    const news = getAllArticles.data ?? {};
    return {
      ...news,
      category_id: news?.category_id?.id,
      tag_ids: news?.tags ? news.tags.map((t) => t.id) : []
    };
  }, [getAllArticles.data]);

  const [realtimeData, setRealtimeData] = useState(initialData);

  useEffect(() => {
    if (!categories.length || !initialData?.id) return;

    form.setFieldsValue(initialData);
    setRealtimeData(initialData);
  }, [initialData, categories, form]);

  function handleValuesChange(changedValue) {
    setRealtimeData((prev) => ({ ...prev, ...changedValue }));
  }

  const handleEditorChange = (editor) => {
    form.setFieldsValue({ content: editor.getContent() });
  };

  useEffect(() => {
    if (!initialData?.id) return;
    fetchThumbnails(token, initialData.id);
    fetchDocs(token, initialData.id);
  }, [initialData.id, fetchThumbnails, token, fetchDocs]);

  const thumbnails = getAllThumbnails.data ?? [];
  const docs = getAllDocs.data ?? [];

  return (
    <div>
      {!getAllArticles.data ? (
        <DataLoader type="datatable" />
      ) : (
        <>
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Typography.Title level={5}>Edit {Modul.ARTICLE}</Typography.Title>
                <small>Edit Artikel {initialData.additional_quiz ? <span className="text-blue-500">Dengan kuisioner tambahan</span> : <span className="text-yellow-500">Tanpa kuisioner tambahan</span>}</small>
              </div>

              <Button onClick={() => navigate(-1)} variant="solid" color="primary">
                Kembali
              </Button>
            </div>
          </Card>
          <Tabs className="px-4">
            <Tabs.TabPane tab="Artikel" key="article">
              <Form
                layout="vertical"
                form={form}
                onValuesChange={handleValuesChange}
                className="grid w-full grid-cols-6 gap-2"
                onFinish={async (values) => {
                  const { isSuccess, message } = await updateArticle.execute(initialData.id, { ...values, additional_quiz: initialData.additional_quiz, _method: 'PUT' }, token);

                  if (isSuccess) {
                    success('Berhasil', message);
                    navigate(-1);
                  } else {
                    error('Gagal', message);
                  }
                }}
              >
                <Card className="col-span-6 lg:col-span-4">
                  <Form.Item
                    className="m-0"
                    name="content"
                    rules={[
                      {
                        required: true,
                        message: 'Konten wajib diisi!'
                      }
                    ]}
                  >
                    <Editor
                      apiKey="ltsdik9bjzzfm8i8g4ve5b32ii5sz0t7j6g2ag5khxm0bn1y"
                      init={{
                        referrer_policy: 'no-referrer',
                        allow_script_urls: true,
                        height: 500,
                        menubar: false,
                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                        toolbar: 'undo redo | blocks | ' + 'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                      onInit={(evt, editor) => {
                        editor.on('change', () => handleEditorChange(editor));
                      }}
                      onEditorChange={(content) => {
                        form.setFieldsValue({ content });
                      }}
                    />
                  </Form.Item>
                </Card>
                <Card className="col-span-6 h-fit lg:col-span-2">
                  <Form.Item
                    className="mb-4"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: 'Judul wajib diisi!'
                      }
                    ]}
                  >
                    <Input placeholder={`Judul ${Modul.ARTICLE}`} size="large" />
                  </Form.Item>
                  <Form.Item
                    className="mb-4"
                    name="category_id"
                    rules={[
                      {
                        required: true,
                        message: 'Kategori wajib diisi!'
                      }
                    ]}
                  >
                    <Select
                      placeholder={`Kategori ${Modul.ARTICLE}`}
                      size="large"
                      options={categories.map((item) => ({
                        label: item.category_name,
                        value: item.id
                      }))}
                    />
                  </Form.Item>
                  <Form.Item className="mb-4" name="tag_ids">
                    <Select
                      mode="multiple"
                      placeholder="Pilih Tag"
                      size="large"
                      options={tags.map((item) => ({
                        label: item.name,
                        value: item.id
                      }))}
                    />
                  </Form.Item>
                  <Form.Item className="mt-2">
                    <div className="flex w-full items-center justify-end gap-x-2">
                      <Button type="default" htmlType="reset" size="large">
                        Reset
                      </Button>
                      <Button size="large" type="primary" htmlType="submit" loading={updateArticle.isLoading}>
                        Kirim
                      </Button>
                    </div>
                  </Form.Item>
                </Card>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thumbnail Artikel" key="thumbnail">
              <Card>
                <Skeleton loading={getAllThumbnails.isLoading}>
                  <Button
                    icon={<PlusOutlined />}
                    variant="solid"
                    color="primary"
                    className="mb-4"
                    onClick={() => {
                      modal.create({
                        title: `Tambah Thumbnail`,
                        formFields: [
                          {
                            label: `Thumbnail`,
                            name: 'thumbnail',
                            type: InputType.UPLOAD,
                            max: 1,
                            beforeUpload: () => {
                              return false;
                            },
                            getFileList: (data) => {
                              return [
                                {
                                  url: data?.logo,
                                  name: data?.category_name
                                }
                              ];
                            },
                            accept: ['.png', '.jpg', '.webp']
                          }
                        ],
                        onSubmit: async (values) => {
                          const { message, isSuccess } = await storeThumbnail.execute({ ...values, artikel_id: initialData.id }, token, values.thumbnail.file);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchThumbnails(token, initialData.id);
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }
                      });
                    }}
                  >
                    Tambah
                  </Button>
                  <div className="w-full max-w-full overflow-x-auto">
                    <DataTable data={thumbnails} columns={thumbnailsColumn({ token: token, deleteThumbnail: deleteThumbnail, error: error, modal: modal, fetchThumbnails: fetchThumbnails, success: success })} loading={getAllThumbnails.isLoading} />
                  </div>
                </Skeleton>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Dokumen Artikel" key="doc">
              <Card>
                <Skeleton loading={getAllDocs.isLoading}>
                  <Button
                    icon={<PlusOutlined />}
                    variant="solid"
                    color="primary"
                    className="mb-4"
                    onClick={() => {
                      modal.create({
                        title: `Tambah Dokumen`,
                        formFields: [
                          {
                            label: `Dokumen`,
                            name: 'dokumen',
                            type: InputType.UPLOAD,
                            max: 1,
                            beforeUpload: () => {
                              return false;
                            },
                            getFileList: (data) => {
                              return [
                                {
                                  url: data?.logo,
                                  name: data?.category_name
                                }
                              ];
                            },
                            accept: ['.pdf']
                          }
                        ],
                        onSubmit: async (values) => {
                          const { message, isSuccess } = await storeDoc.execute({ ...values, artikel_id: initialData.id }, token, values.dokumen.file);
                          if (isSuccess) {
                            success('Berhasil', message);
                            fetchDocs(token, initialData.id);
                          } else {
                            error('Gagal', message);
                          }
                          return isSuccess;
                        }
                      });
                    }}
                  >
                    Tambah
                  </Button>
                  <div className="w-full max-w-full overflow-x-auto">
                    <DataTable data={docs} columns={docsColumn({ token: token, deleteDoc: deleteDoc, error: error, modal: modal, fetchDoc: fetchDocs, success: success })} loading={getAllDocs.isLoading} />
                  </div>
                </Skeleton>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Edit;
