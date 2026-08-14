import { AdminStatisticCard, AdminStatisticChart, DashboardProfileCard, HidrologiWsStatisticCard, KuesionerRingkasanCard, ObservationPosMap, PosPerJenisCard, TopArtikelCard } from '@/components';
import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { DashboardService } from '@/services';
import asset from '@/utils/asset';
import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton } from 'antd';
import React from 'react';

const QUICK_ACCESS_CONFIG = [
  { key: 'artikel', label: 'Informasi Teknis', color: '#059669', navigationPath: '/dashboard/articles' },
  { key: 'berita', label: 'Berita', color: '#2563EB', navigationPath: '/dashboard/news' },
  { key: 'pemetaan', label: 'Pemetaan GIS', color: '#7C3AED', navigationPath: '/dashboard/maps' },
  { key: 'pos', label: 'Pos Pengamatan', color: '#D97706', navigationPath: '/dashboard/observation_pos' }
];

const AdminDashboard = () => {
  const { token, onUnauthorized } = useAuth();
  const { execute: fetchStatistik, ...statistik } = useAbortableService(DashboardService.getStatistik, { onUnauthorized });
  const { execute: fetchWilayahSungai, ...wilayahSungai } = useAbortableService(DashboardService.getWilayahSungai, { onUnauthorized });
  const { execute: fetchStatistikTambahan, ...statistikTambahan } = useAbortableService(DashboardService.getStatistikTambahan, { onUnauthorized });

  React.useEffect(() => {
    fetchStatistik({ token });
    fetchWilayahSungai({ token });
    fetchStatistikTambahan({ token });
  }, [fetchStatistik, fetchWilayahSungai, fetchStatistikTambahan, token]);

  const scrollRef = React.useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: 'smooth'
    });
  };

  const quickAccess = statistik.data?.quick_access ?? {};

  const chartData = QUICK_ACCESS_CONFIG.map(({ key, label, color }) => ({
    type: label,
    value: quickAccess[key] ?? 0,
    color
  }));

  const wsData = wilayahSungai.data ?? [];

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-9 flex flex-col gap-y-4">
        <Card title="Quick Access" className="col-span-9 h-fit">
          {statistik.isLoading ? (
            <div className="grid grid-cols-12 gap-4">
              {QUICK_ACCESS_CONFIG.map((item) => (
                <div key={item.key} className="col-span-3">
                  <Skeleton.Node
                    active
                    style={{
                      width: '100%',
                      height: 120
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {QUICK_ACCESS_CONFIG.map((item) => (
                <AdminStatisticCard key={item.key} label={item.label} navigationPath={item.navigationPath} value={quickAccess[item.key] ?? 0} />
              ))}
            </div>
          )}
        </Card>
        <Card
          title=" Berdasarkan Data Wilayah Sungai"
          extra={
            <div className="inline-flex gap-x-2">
              <Button shape="circle" size="small" icon={<LeftOutlined />} onClick={scrollLeft} />

              <Button shape="circle" type="primary" size="small" icon={<RightOutlined />} onClick={scrollRight} />
            </div>
          }
          className="w-full"
        >
          {wilayahSungai.isLoading ? (
            <Skeleton.Node
              active
              style={{
                width: '100%',
                height: 240
              }}
            />
          ) : (
            <div ref={scrollRef} className="inline-flex w-full items-center gap-x-6 overflow-x-auto pb-8">
              {wsData.map((item) => (
                <HidrologiWsStatisticCard
                  key={item.id}
                  label={item.nama}
                  thumbnail={item.thumbnail ? asset(item.thumbnail) : undefined}
                  data={[
                    { label: 'Informasi Teknis', value: item.artikel },
                    { label: 'Berita', value: item.berita },
                    { label: 'Pos Pengamatan', value: item.pos }
                  ]}
                />
              ))}
            </div>
          )}
        </Card>
        <ObservationPosMap
          extra={
            <Button className="" variant="outlined" shape="round" color="primary" icon={<PlusOutlined />}>
              Kelola Pos
            </Button>
          }
        />
        <div className="grid w-full grid-cols-12 gap-4">
          <div className="col-span-4">
            <TopArtikelCard data={statistikTambahan.data?.top_artikel} loading={statistikTambahan.isLoading} />
          </div>
          <div className="col-span-4">
            <PosPerJenisCard data={statistikTambahan.data?.pos_per_jenis} loading={statistikTambahan.isLoading} />
          </div>
          <div className="col-span-4">
            <KuesionerRingkasanCard data={statistikTambahan.data?.kuesioner} loading={statistikTambahan.isLoading} />
          </div>
        </div>
      </div>
      <div className="col-span-3 flex flex-col gap-y-4">
        <DashboardProfileCard />
        <AdminStatisticChart data={chartData} loading={statistik.isLoading} />
      </div>
    </div>
  );
};

export default AdminDashboard;
