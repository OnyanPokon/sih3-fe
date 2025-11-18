import asset from '@/utils/asset';
import { Button, Card, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const thumbnailsColumn = ({ modal, success, error, deleteThumbnail, token, fetchThumbnails }) => {
  return [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      sorter: (a, b) => a.thumbnail.length - b.thumbnail.length,
      searchable: true,
      render: (record) => (
        <div className="flex items-center justify-center">
          <Card className="[&_.ant-card-body]:!p-2">
            <img src={asset(record)} className="aspect-video max-w-36" loading="lazy" />
          </Card>
        </div>
      )
    },
    {
      title: 'Aksi',
      width: '70%',
      render: (_, record) => (
        <Space size="small">
          <Button
            variant="outlined"
            color="danger"
            icon={<DeleteOutlined />}
            onClick={() => {
              modal.delete.default({
                title: `Delete Thumbnail`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteThumbnail.execute(token, record.id);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchThumbnails(token, record.id);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    }
  ];
};

export const docsColumn = ({ modal, success, error, deleteDoc, token, fetchDoc }) => {
  return [
    {
      title: 'Thumbnail',
      dataIndex: 'dokumen',
      sorter: (a, b) => a.dokumen.length - b.dokumen.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Button
            variant="outlined"
            color="danger"
            icon={<DeleteOutlined />}
            onClick={() => {
              modal.delete.default({
                title: `Delete Dokumen`,
                data: record,
                onSubmit: async () => {
                  const { isSuccess, message } = await deleteDoc.execute(token, record.id);
                  if (isSuccess) {
                    success('Berhasil', message);
                    fetchDoc(token, record.id);
                  } else {
                    error('Gagal', message);
                  }
                  return isSuccess;
                }
              });
            }}
          />
        </Space>
      )
    }
  ];
};
