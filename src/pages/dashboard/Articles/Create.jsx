import Modul from '@/constants/Modul';
import { useAuth, useNotification, useService } from '@/hooks';
import { CategoriesService, ArticlesService, TagsService } from '@/services';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import strings from '@/utils/strings';
import useAbortableService from '@/hooks/useAbortableService';

const Create = () => {
  const { token, onUnauthorized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { success, error } = useNotification();
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAll, { onUnauthorized });
  const { execute: fetchTags, ...getAllTags } = useAbortableService(TagsService.getAll, { onUnauthorized });
  const storeArticle = useService(ArticlesService.store);

  useEffect(() => {
    fetchCategories({ token: token, per_page: 'all' });
    fetchTags({ token: token, per_page: 'all' });
  }, [fetchCategories, fetchTags, token]);

  const categories = getAllCategories.data ?? [];
  const tags = getAllTags.data ?? [];

  const handleEditorChange = (editor) => {
    const content = editor.getContent();
    form.setFieldsValue({ content });
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography.Title level={5}>Tambah {Modul.ARTICLE}</Typography.Title>
            <small>Buat Artikel {location.state.withQuiz ? <span className="text-blue-500">Dengan kuisioner tambahan</span> : <span className="text-yellow-500">Tanpa kuisioner tambahan</span>}</small>
          </div>
          <Button onClick={() => navigate(-1)} variant="solid" color="primary">
            Kembali
          </Button>
        </div>
      </Card>
      <Form
        layout="vertical"
        form={form}
        className="grid w-full grid-cols-6 gap-2"
        onFinish={async (values) => {
          const thumbnails = values.thumbnails ? values.thumbnails.fileList.map((f) => f.originFileObj) : [];

          const dokumen = values.doc ? values.doc.fileList.map((f) => f.originFileObj) : [];

          const payload = {
            ...values,
            additional_quiz: location.state.withQuiz ? 1 : 0,
            thumbnails,
            doc: dokumen,
            tag_ids: values.tag_ids || []
          };

          const { message, isSuccess } = await storeArticle.execute(payload, token);
          if (isSuccess) {
            success('Berhasil', message);
            navigate(-1);
          } else {
            error('Gagal', message);
          }
          return isSuccess;
        }}
      >
        <Card className="col-span-6 h-fit lg:col-span-4">
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
        <Card className="col-span-6 h-fit lg:col-span-2">
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
          <Form.Item
            label="Thumbnail Artikel"
            className="mb-4"
            name="thumbnails"
            rules={[
              {
                required: true,
                message: 'Gambar wajib diisi!'
              }
            ]}
          >
            <Dragger
              accept={['.png', '.jpg', '.jpeg', 'webp'].join(', ')}
              name={'thumbnail'}
              maxCount={10}
              beforeUpload={() => {
                return false;
              }}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{strings('click_or_drag_file_to_this_area_to_upload')}</p>
              <p className="ant-upload-hint">{strings('accepted_file_types_s', ['.png', '.jpg', '.jpeg', 'webp'].join(', '))}</p>
            </Dragger>
          </Form.Item>
          <Form.Item
            label="Dokumen Artikel"
            className="mb-4"
            name="doc"
            rules={[
              {
                required: true,
                message: 'Doc wajib diisi!'
              }
            ]}
          >
            <Dragger
              accept={['.pdf'].join(', ')}
              name={'thumbnail'}
              maxCount={10}
              beforeUpload={() => {
                return false;
              }}
              listType="picture"
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
              <Button size="large" type="primary" htmlType="submit" loading={storeArticle.isLoading}>
                Kirim
              </Button>
            </div>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default Create;
