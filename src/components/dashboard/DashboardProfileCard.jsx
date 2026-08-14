import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { DashboardService } from '@/services';
import relativeDate from '@/utils/relativeDate';
import { FolderFilled } from '@ant-design/icons';
import { Card, Empty, Skeleton, Typography } from 'antd';
import React from 'react';

const JENIS_LABEL = {
  artikel: 'Informasi Teknis',
  berita: 'Berita',
  pemetaan: 'Pemetaan GIS',
  produk_hukum: 'Produk Hukum'
};

const DashboardProfileCard = () => {
  const { user, token, onUnauthorized } = useAuth();
  const { execute: fetchAktivitasTerbaru, ...getAktivitasTerbaru } = useAbortableService(DashboardService.getAktivitasTerbaru, { onUnauthorized });

  React.useEffect(() => {
    fetchAktivitasTerbaru({ token, per_page: 5 });
  }, [fetchAktivitasTerbaru, token]);

  const aktivitasTerbaru = getAktivitasTerbaru.data ?? [];

  return (
    <Card title="Profil">
      <div className="flex flex-col items-center justify-center gap-y-2">
        {/* Avatar */}
        {!user ? (
          <Skeleton.Avatar active size={80} shape="circle" />
        ) : (
          <div className="rounded-full border border-blue-500 p-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-semibold text-blue-500">SA</div>
          </div>
        )}

        {/* Nama */}
        <div className="flex flex-col items-center gap-y-2 text-center">
          {!user ? (
            <>
              <Skeleton.Input active size="small" style={{ width: 180 }} />
              <Skeleton.Input active size="small" style={{ width: 240 }} />
            </>
          ) : (
            <>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Hai! 👋 {user?.name}
              </Typography.Title>

              <span className="text-xs text-gray-500">
                {user?.unor?.nama} - Personil {user?.unor?.kategoris?.map((k) => k.nama).join(', ')}
              </span>
            </>
          )}
        </div>

        <hr className="my-2 w-full" />

        <span className="w-full text-xs font-semibold">Publikasi Terakhir :</span>

        <div className="w-full divide-y rounded-md bg-blue-50/60 px-3">
          {getAktivitasTerbaru.isLoading ? (
            <div className="flex items-center gap-3 py-3">
              <Skeleton.Avatar active shape="square" size={40} />
              <div className="flex-1">
                <Skeleton.Input active size="small" style={{ width: '70%', marginBottom: 8 }} />
                <Skeleton.Input active size="small" style={{ width: '45%' }} />
              </div>
            </div>
          ) : aktivitasTerbaru.length === 0 ? (
            <div className="py-6">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada publikasi" />
            </div>
          ) : (
            aktivitasTerbaru.map((item, index) => (
              <div key={index} className="flex items-center gap-x-2 py-3">
                <FolderFilled className="text-2xl text-blue-700" />
                <div className="flex min-w-0 flex-col">
                  <p className="text-xs font-semibold">{item.judul}</p>
                  <span className="text-xs text-gray-500">
                    {JENIS_LABEL[item.jenis] ?? item.jenis} - {item.unor_nama ? `${item.unor_nama} - ` : ''}
                    {item.tanggal ? relativeDate(item.tanggal) : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default DashboardProfileCard;
