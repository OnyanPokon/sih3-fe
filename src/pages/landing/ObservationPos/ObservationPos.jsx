import { DataTable } from '@/components';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ObservationPosService } from '@/services';
import { ArrowLeftOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton, Space, Tooltip, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ObservationPos = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { onUnauthorized } = useAuth();
  const { execute: fetchObservationPos, ...getAllObservationPos } = useAbortableService(ObservationPosService.getAllInLanding, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllObservationPos.totalData });

  React.useEffect(() => {
    fetchObservationPos({ page: pagination.page, per_page: pagination.perPage, jenis_pos_id: params.pos_type_id });
  }, [fetchObservationPos, pagination.page, pagination.perPage, params.pos_type_id]);

  const observationPos = getAllObservationPos.data ?? [];

  const column = [
    {
      title: 'Nama Pos',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Koordinat',
      dataIndex: 'coordinate',
      sorter: (a, b) => a.coordinate.length - b.coordinate.length,
      searchable: true
    },
    {
      title: 'Koordinat',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ps Pengamatan">
            <Button icon={<DatabaseOutlined />} variant="outlined" color="primary" onClick={() => navigate('/pos_pengamatan/' + record.id)}>
              Pos Pengamatan
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/pos_pengamatan_bg.jpeg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 py-20 pt-48">
          <div className="w-full">
            <div className="mb-6 flex w-fit items-center gap-x-2 gap-y-1">
              <Button shape="round" size="small" color="danger" variant="solid" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              Pos Pengamatan
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Informasi Pos Pengamatan SIH3</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 pt-12">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-32">
          <div className="">
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              {getAllObservationPos.isLoading ? (
                <Card className="w-full">
                  <Skeleton active />
                </Card>
              ) : (
                <Card className="w-full">
                  <DataTable data={observationPos} columns={column} loading={getAllObservationPos.isLoading} pagination={pagination} />
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ObservationPos;
