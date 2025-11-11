import { DataLoader } from '@/components';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import Modul from '@/constants/Modul';
import { useAuth, useNotification, useService } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import strings from '@/utils/strings';
import { ArticlesService, CategoriesService } from '@/services';
import useAbortableService from '@/hooks/useAbortableService';

const Edit = () => {
  const { token, onUnauthorized } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [form] = Form.useForm();
  const { success, error } = useNotification();
  const { execute: fetchArticles, ...getAllArticles } = useService(ArticlesService.getBySlug);
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });
  const updateArticle = useService(ArticlesService.update);
  const [thumbList, setThumbList] = useState([]);
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    fetchArticles({ slug, token });
    fetchCategories({ token });
  }, [fetchArticles, fetchCategories, slug, token]);

  const categories = useMemo(() => getAllCategories.data ?? [], [getAllCategories.data]);

  const initialData = useMemo(() => {
    const news = getAllArticles.data ?? {};
    return {
      ...news,
      category_id: news?.category_id?.id
    };
  }, [getAllArticles.data]);

  const [realtimeData, setRealtimeData] = useState(initialData);

  useEffect(() => {
    if (!categories.length || !initialData?.id) return;
    form.setFieldsValue(initialData ?? {});
    setRealtimeData(initialData ?? {});
  }, [initialData, categories, form]);

  function handleValuesChange(changedValue) {
    setRealtimeData({ ...realtimeData, ...changedValue });
  }

  const handleEditorChange = (editor) => {
    const content = editor.getContent();
    form.setFieldsValue({ content });
  };
  useEffect(() => {
    if (!initialData?.id) return;

    // Lama = status: "done"
    const thumb =
      initialData.thumbnails?.map((t) => ({
        uid: `thumb-${t.id}`,
        id: t.id,
        name: t.thumbnail.split('/').pop(),
        status: 'done',
        url: t.thumbnail,
        thumbUrl: t.thumbnail
      })) ?? [];

    const doc =
      initialData.doc?.map((d) => ({
        uid: `doc-${d.id}`,
        id: d.id,
        name: d.doc.split('/').pop(),
        status: 'done',
        url: d.doc,
        thumbUrl: d.doc
      })) ?? [];

    setThumbList(thumb);
    setDocList(doc);

    form.setFieldsValue({
      ...initialData,
      thumbnails: thumb,
      doc: doc
    });
  }, [form, initialData]);

  return (
    <div>
      {getAllArticles.data === 0 ? (
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
          <Form
            layout="vertical"
            form={form}
            onValuesChange={handleValuesChange}
            className="grid w-full grid-cols-6 gap-2"
            onFinish={async (values) => {
              const payload = {
                ...values,
                additional_quiz: initialData.additional_quiz,
                thumbnails: values.thumbnails ?? [],
                doc: values.doc ?? [],
                _method: 'PUT'
              };

              const { isSuccess, message } = await updateArticle.execute({
                id: initialData.id,
                data: payload,
                token
              });

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
            <Card className="col-span-6 lg:col-span-2">
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
              <Form.Item label="Thumbnail Artikel" name="thumbnails" rules={[{ required: true, message: 'Gambar wajib diisi!' }]}>
                <Dragger
                  accept=".png,.jpg,.jpeg,.webp"
                  maxCount={10}
                  beforeUpload={() => false}
                  fileList={thumbList}
                  onChange={({ fileList }) => {
                    setThumbList(fileList);
                    form.setFieldsValue({ thumbnails: fileList }); // manual sync
                  }}
                  listType="picture"
                  onRemove={(file) => {
                    const newList = thumbList.filter((f) => f.uid !== file.uid);
                    setThumbList(newList);
                    form.setFieldsValue({ thumbnails: newList });
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
                  <p className="ant-upload-hint">{strings('accepted_file_types_s', ['.png', '.jpg', '.jpeg', 'webp'].join(', '))}</p>
                </Dragger>
              </Form.Item>
              <Form.Item label="Dokumen Artikel" name="doc" rules={[{ required: true, message: 'Gambar wajib diisi!' }]}>
                <Dragger
                  accept=".pdf"
                  maxCount={10}
                  beforeUpload={() => false}
                  fileList={docList}
                  onChange={({ fileList }) => {
                    setDocList(fileList);
                    form.setFieldsValue({ doc: fileList }); // manual sync
                  }}
                  listType="text"
                  onRemove={(file) => {
                    const newList = docList.filter((f) => f.uid !== file.uid);
                    setDocList(newList);
                    form.setFieldsValue({ doc: newList });
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
                  <p className="ant-upload-hint">{strings('accepted_file_types_s', ['.pdf'].join(', '))}</p>
                </Dragger>
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
        </>
      )}
    </div>
  );
};

export default Edit;
