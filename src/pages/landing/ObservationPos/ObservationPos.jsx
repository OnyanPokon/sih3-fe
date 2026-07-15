import { DataTable } from '@/components';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ObservationPosService } from '@/services';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Progress, Spin, Typography } from 'antd';
import { SignpostBig, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

const ObservationPos = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { onUnauthorized } = useAuth();
  const { execute: fetchObservationPos, ...getAllObservationPos } = useAbortableService(ObservationPosService.getAllInLanding, { onUnauthorized });
  const pagination = usePagination({ totalData: getAllObservationPos.totalData });

  React.useEffect(() => {
    fetchObservationPos({ page: 1, per_page: 9999, jenis_pos_id: params.pos_type_id });
  }, [fetchObservationPos, pagination.page, pagination.perPage, params.pos_type_id]);

  const observationPos = getAllObservationPos.data ?? [];

  const loadingSteps = [
    {
      title: 'Menyiapkan permintaan',
      description: 'Menyiapkan parameter pencarian.'
    },
    {
      title: 'Menghubungi server',
      description: 'Mengirim permintaan ke server SIH3.'
    },
    {
      title: 'Mengambil data',
      description: 'Server sedang mengambil data pos pengamatan.'
    },
    {
      title: 'Memproses koordinat',
      description: 'Menyusun data koordinat untuk ditampilkan.'
    },
    {
      title: 'Menyiapkan tampilan',
      description: 'Hampir selesai.'
    }
  ];

  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (observationPos.length) return;

    setStep(0);

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= loadingSteps.length - 1) return prev;

        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [loadingSteps.length, observationPos.length]);

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
      title: 'ALamat',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      searchable: true
    },
    {
      title: 'Aksi',
      sorter: (a, b) => a.address.length - b.address.length,
      searchable: true
    }
  ];

  const markers = observationPos
    .map((item) => {
      if (!item.coordinate) return null;

      const [lat, lng] = item.coordinate.split(',').map((v) => Number(v.trim()));

      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

      return {
        ...item,
        lat,
        lng
      };
    })
    .filter(Boolean);

  const center = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [0.5435, 123.056]; // Gorontalo

  const latestUpdate = [...observationPos].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  return (
    <>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/pos_pengamatan_bg.png')",
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
      <section className="bg-gray-50">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-12">
          <div className="">
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              {getAllObservationPos.isLoading ? (
                <Card>
                  <div className="w-[420px] rounded-2xl bg-white p-8">
                    <div className="flex justify-center">
                      <Spin size="large" />
                    </div>

                    <Typography.Title level={4} className="!mb-1 !mt-6 text-center">
                      {loadingSteps[step].title}
                    </Typography.Title>

                    <Typography.Paragraph type="secondary" className="text-center">
                      {loadingSteps[step].description}
                    </Typography.Paragraph>

                    <div className="mt-6">
                      <Progress percent={100} showInfo={false} status="active" />
                    </div>
                  </div>
                </Card>
              ) : (
                <>
                  <div className="flex w-full gap-x-4">
                    <Card className="w-full flex-[2]" title={<div className="inline-flex items-center gap-x-2">Peta Sebaran Pos Pengamatan</div>}>
                      <MapContainer center={center} zoom={9} scrollWheelZoom className="h-[480px] rounded-xl">
                        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {markers.map((item) => (
                          <Marker key={item.id} position={[item.lat, item.lng]}>
                            <Popup>
                              <div className="space-y-2">
                                <Typography.Title level={5} className="!mb-1">
                                  {item.name}
                                </Typography.Title>

                                <Typography.Text>{item.address}</Typography.Text>

                                <br />

                                <Typography.Text type="secondary">{item.coordinate}</Typography.Text>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </Card>
                    <div className="flex-[1]">
                      <Card
                        style={{
                          backgroundImage: "url('/image_asset/background/legal_products_card_bg.png')",
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)'
                        }}
                        className="mb-4 h-fit w-full"
                      >
                        <Typography.Title level={5} style={{ color: '#fff' }}>
                          Ringkasan Pos Pengamatan
                        </Typography.Title>
                        <div className="inline-flex w-full items-center justify-between text-white">
                          <span className="inline-flex items-start gap-x-2 text-xs">
                            <SignpostBig size={16} />
                            Total Pos
                          </span>
                          <span className="text-xs">123 Pos</span>
                        </div>
                        <div className="inline-flex w-full items-center justify-between text-white">
                          <span className="inline-flex items-start gap-x-2 text-xs">
                            <TrendingUpDown size={16} />
                            Jenis Pos
                          </span>
                          <span className="text-xs">Hidrologi</span>
                        </div>
                      </Card>
                      <Card title="Kiat Infromasi Dataset">
                        <div className="flex flex-col gap-y-6">
                          <div className="inline-flex items-center gap-x-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 p-4 transition-all duration-300">
                              <CalendarOutlined className="text-lg text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-bold">Data Terlama</p>
                              <span className="text-sm">12 Jan 2023</span>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-x-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 p-4 transition-all duration-300">
                              <ClockCircleOutlined className="text-lg text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-bold">Pembaruan Terkahir</p>
                              <span className="text-sm">{latestUpdate ? new Date(latestUpdate.updated_at).toLocaleString() : 'Tidak ada data'}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <Card className="w-full" title={<div className="inline-flex items-center gap-x-2">Data Tabular</div>} extra={<Button icon={<DownloadOutlined />}>Export Excel</Button>}>
                    <DataTable data={observationPos} columns={column} loading={getAllObservationPos.isLoading} pagination={pagination} />
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ObservationPos;
