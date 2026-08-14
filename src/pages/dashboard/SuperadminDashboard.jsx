import { KuesionerRingkasanCard, ObservationPosMap, PosPerJenisCard, TopArtikelCard } from '@/components';
import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { DashboardService, LegalProductsService } from '@/services';
import relativeDate from '@/utils/relativeDate';
import { BranchesOutlined, FilePdfOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Empty, Skeleton, Typography } from 'antd';
import { CloudHail, Droplet, FileText, Gavel, Layers2, Map, Newspaper, Rss } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';

const KPI_KEYS = [
  { key: 'artikel', label: 'Informasi Teknis', icon: Newspaper },
  { key: 'berita', label: 'Berita', icon: FileText },
  { key: 'pemetaan', label: 'Pemetaan GIS', icon: Map },
  { key: 'pos', label: 'Pos Pengamatan', icon: Rss }
];

const KpiItem = ({ item, value, loading, dark, spanClass = 'col-span-3', iconClassName = '' }) => {
  const Icon = item.icon;

  return (
    <div className={`${spanClass} inline-flex items-center gap-x-3 rounded-lg p-4 ${dark ? 'bg-white/20' : 'bg-gray-50'}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${dark ? 'bg-white/20 text-white' : iconClassName}`}>
        <Icon size={28} />
      </div>
      <div className="flex flex-col">
        <small className={dark ? 'text-white/80' : ''}>{item.label}</small>
        {loading ? <Skeleton.Input active size="small" style={{ width: 40 }} /> : <span className="text-xl">{value}</span>}
      </div>
    </div>
  );
};

KpiItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired
  }).isRequired,
  value: PropTypes.number,
  loading: PropTypes.bool,
  dark: PropTypes.bool,
  spanClass: PropTypes.string,
  iconClassName: PropTypes.string
};

const SuperadminDashboard = () => {
  const { token, onUnauthorized } = useAuth();
  const { execute: fetchStatistik, ...statistik } = useAbortableService(DashboardService.getStatistik, { onUnauthorized });
  const { execute: fetchStatistikTambahan, ...statistikTambahan } = useAbortableService(DashboardService.getStatistikTambahan, { onUnauthorized });
  const { execute: fetchProdukHukum, ...produkHukum } = useAbortableService(LegalProductsService.getAll, { onUnauthorized });

  React.useEffect(() => {
    fetchStatistik({ token });
    fetchStatistikTambahan({ token });
    fetchProdukHukum({ token, per_page: 5 });
  }, [fetchStatistik, fetchStatistikTambahan, fetchProdukHukum, token]);

  const kategoriBySlug = (slug) => statistik.data?.kategoris?.find((kategori) => kategori.slug === slug) ?? { artikel: 0, berita: 0, pemetaan: 0, pos: 0 };

  const hidrologi = kategoriBySlug('hidrologi');
  const hidrometeorologi = kategoriBySlug('hidrometeorologi');
  const hidrogeologi = kategoriBySlug('hidrogeologi');

  const isStatistikLoading = statistik.isLoading;

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-12 inline-flex w-full items-center justify-between">
        <Typography.Title className="w-full" level={3}>
          Dashboard SIH3
        </Typography.Title>
        <div className="inline-flex items-center gap-x-2 rounded-md bg-white p-1.5">
          <Button icon={<PlusOutlined />} variant="solid" color="primary">
            Produk Hukum
          </Button>
          <Button icon={<UserAddOutlined />} variant="solid">
            Personil
          </Button>
          <Button icon={<BranchesOutlined />} variant="solid">
            Unor
          </Button>
        </div>
      </div>
      <div className="col-span-8 flex flex-col gap-y-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
        <div className="w-fit rounded-full bg-white/20 px-4 py-1 text-sm text-white">Analisis Terbaru</div>
        <div className="inline-flex w-full items-center gap-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20">
            <Droplet size={38} />
          </div>
          <div className="flex flex-col">
            <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
              Data Hidrologi Provinsi Gorontalo
            </Typography.Title>
            <span>Pantauan komprehensif data air permukaan</span>
          </div>
        </div>
        <div className="grid w-full grid-cols-12 gap-4">
          {KPI_KEYS.map((item) => (
            <KpiItem key={item.key} item={item} value={hidrologi[item.key]} loading={isStatistikLoading} dark />
          ))}
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-y-6 rounded-xl bg-white p-6">
        <div className="inline-flex items-center gap-x-2">
          <CloudHail className="text-green-500" size={28} />
          <span className="">Hidrometeorologi</span>
        </div>
        <div className="grid grid-cols-12 gap-2">
          {KPI_KEYS.map((item) => (
            <KpiItem key={item.key} item={item} value={hidrometeorologi[item.key]} loading={isStatistikLoading} spanClass="col-span-6" iconClassName="bg-green-100 text-green-500" />
          ))}
        </div>
      </div>
      <div className="col-span-8 w-full">
        <ObservationPosMap />
      </div>
      <div className="col-span-4 flex w-full flex-col gap-y-4">
        <div className="flex h-fit flex-col gap-y-6 rounded-xl bg-white p-6">
          <div className="inline-flex items-center gap-x-2">
            <Layers2 className="text-amber-500" size={28} />
            <span className="">Hidrogeologi</span>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {KPI_KEYS.map((item) => (
              <KpiItem key={item.key} item={item} value={hidrogeologi[item.key]} loading={isStatistikLoading} spanClass="col-span-6" iconClassName="bg-amber-100 text-amber-500" />
            ))}
          </div>
        </div>
        <div className="flex h-fit flex-col gap-y-3 rounded-xl bg-white p-6">
          <div className="inline-flex items-center gap-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-500">
              <Gavel size={28} />
            </div>
            <div className="flex flex-col">
              <small className="">Total Produk Hukum</small>
              {isStatistikLoading ? <Skeleton.Input active size="small" style={{ width: 40 }} /> : <span className="text-xl">{statistik.data?.total_produk_hukum ?? 0}</span>}
            </div>
          </div>
          <hr />
          <p className="font-semibold">Baru ini diunggah :</p>
          {produkHukum.isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : produkHukum.data && produkHukum.data.length > 0 ? (
            produkHukum.data.map((item) => (
              <div key={item.id} className="inline-flex w-full items-center justify-between rounded-lg bg-gray-100 p-4">
                <div className="flex min-w-0 flex-col gap-y-1">
                  <span className="font-semibold">{item.title}</span>
                  <small>
                    {item.unor_id?.name} - {item.created_at ? relativeDate(item.created_at) : ''}
                  </small>
                </div>
                <Button icon={<FilePdfOutlined />} href={item.file} target="_blank" rel="noreferrer" />
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada produk hukum" />
          )}
        </div>
      </div>
      <div className="col-span-12 grid w-full grid-cols-12 gap-4">
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
  );
};

export default SuperadminDashboard;
