import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { CategoriesService, PosTypesService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { getThemeByCategory } from '@/utils/getThemeByCategory';
import { RightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Input, Radio, Skeleton, Typography } from 'antd';
import { Calendar, Gavel, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PosTypes = () => {
  const navigte = useNavigate();
  const { onUnauthorized } = useAuth();
  const { execute: fetchPosTypes, ...getAllPosTypes } = useAbortableService(PosTypesService.getAllInLanding, { onUnauthorized });
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAllInLanding, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPosTypes.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '', kategori_id: null });

  const categories = React.useMemo(() => getAllCategories.data ?? [], [getAllCategories.data]);

  // 🔹 Fetch categories once
  React.useEffect(() => {
    fetchCategories({});
  }, [fetchCategories]);

  React.useEffect(() => {
    fetchPosTypes({
      page: pagination.page,
      per_page: pagination.perPage,
      kategori_id: filterValues.kategori_id ?? undefined,
      search: filterValues.search
    });
  }, [pagination.page, pagination.perPage, fetchPosTypes, filterValues.kategori_id, filterValues.search]);

  const posTypes = getAllPosTypes.data ?? [];

  return (
    <>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/hero_bg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 py-20 pt-48">
          <div className="w-full max-w-sm">
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              Jenis Pos
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi Provinsi Gorontalo. Pantau data titik pengamatan secara real-time untuk keberlanjutan sumber daya air.</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-2 p-6">
          <Input.Search allowClear onSearch={(values) => setFilterValues((prev) => ({ ...prev, search: values }))} size="large" placeholder="Cari nama jenis pos" className="max-w-md" />
          <Radio.Group
            value={filterValues.kategori_id}
            onChange={(e) => {
              setFilterValues((prev) => ({ ...prev, kategori_id: e.target.value }));
            }}
            size="large"
          >
            <Radio.Button value={null}>Semua</Radio.Button>

            {categories.map((item) => (
              <Radio.Button value={item.id} key={item.id}>
                {item.category_name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-12 py-12">
          <div className="flex flex-wrap items-start justify-start gap-4">
            {getAllPosTypes.isLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Card className="w-full max-w-[382px]" key={i}>
                  <Skeleton active />
                </Card>
              ))
            ) : posTypes.length > 0 ? (
              posTypes.map((item) => {
                const theme = getThemeByCategory(item.id_kategori.category_name);

                return (
                  <Card key={item.id} className="w-full max-w-[382px]">
                    <div className="text-gray-500">
                      <Typography.Title level={5}>
                        <span className="news-text">{item.name}</span>
                      </Typography.Title>
                      <div className="inline-flex w-full items-center justify-between">
                        <span className="inline-flex items-start gap-x-2 text-xs">
                          <TrendingUpDown size={16} />
                          Jenis Pos
                        </span>
                        <span className={`rounded-full ${theme.bg} mb-2 px-3 py-1 text-xs font-medium text-white`}>{item.id_kategori.category_name}</span>
                      </div>
                      <div className="inline-flex w-full items-center justify-between">
                        <span className="inline-flex items-start gap-x-2 text-xs">
                          <Gavel size={16} />
                          Kewenangan
                        </span>
                        <span className="text-xs">{item.authority}</span>
                      </div>
                      <div className="inline-flex w-full items-center justify-between">
                        <span className="inline-flex items-start gap-x-2 text-xs">
                          <Calendar size={16} />
                          Update Terakhir
                        </span>
                        <span className="text-xs">{dateFormatter(item.updated_at, 'dd MMMM yyyy')}</span>
                      </div>

                      <Button icon={<RightOutlined className="text-xs" />} variant="outlined" color="primary" className="mt-4 w-full" iconPosition="end" onClick={() => navigte('/pos_pengamatan/' + item.id)}>
                        Lihat Detail
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="flex w-full justify-center py-20">
                <Empty description={filterValues.search || filterValues.kategori_id ? 'Tidak ada jenis pos yang sesuai dengan filter.' : 'Belum ada data jenis pos.'} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PosTypes;
