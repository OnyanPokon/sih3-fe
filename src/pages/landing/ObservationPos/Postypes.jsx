import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { CategoriesService, PosTypesService } from '@/services';
import dateFormatter from '@/utils/dateFormatter';
import { getThemeByCategory } from '@/utils/getThemeByCategory';
import { RightOutlined } from '@ant-design/icons';
import { Button, Card, Input, Radio, Skeleton, Typography } from 'antd';
import { Calendar, Gavel, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PosTypes = () => {
  const navigte = useNavigate();
  const { onUnauthorized } = useAuth();
  const { execute: fetchPosTypes, ...getAllPosTypes } = useAbortableService(PosTypesService.getAllInLanding, { onUnauthorized });
  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAllInLanding, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllPosTypes.totalData });
  const [activeTab, setActiveTab] = React.useState(null);

  const categories = React.useMemo(() => getAllCategories.data ?? [], [getAllCategories.data]);

  // 🔹 Fetch categories once
  React.useEffect(() => {
    fetchCategories({});
  }, [fetchCategories]);

  // 🔹 Set default tab AFTER categories loaded
  React.useEffect(() => {
    if (categories.length > 0 && activeTab === null) {
      setActiveTab(categories[0].id); // tab pertama
    }
  }, [categories, activeTab]);

  // 🔹 Fetch Pos Types whenever tab or pagination changes
  React.useEffect(() => {
    fetchPosTypes({
      page: pagination.page,
      per_page: pagination.perPage
    });
  }, [activeTab, pagination.page, pagination.perPage, fetchPosTypes]);

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
          <Input.Search size="large" placeholder="Cari nama jenis pos" className="max-w-md" />
          <Radio.Group defaultValue="a" size="large" className="">
            <Radio.Button value="a">Semua</Radio.Button>
            <Radio.Button value="b">Hidrologi</Radio.Button>
            <Radio.Button value="c">Hidrometeorologi</Radio.Button>
            <Radio.Button value="d">Hidrogeologi</Radio.Button>
          </Radio.Group>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-12 py-12">
          <div className="flex flex-wrap items-start justify-start gap-4">
            {getAllPosTypes.isLoading
              ? Array.from({ length: 3 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[382px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : posTypes?.map((item) => {
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
                })}
          </div>
          {/* <div className="">
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              {getAllPosTypes.isLoading || getAllCategories.isLoading ? (
                <Card className="w-full">
                  <Skeleton active />
                </Card>
              ) : (
                <Card className="w-full">
                  <Tabs activeKey={String(activeTab)} onChange={(key) => setActiveTab(Number(key))}>
                    {categories.map((item) => (
                      <Tabs.TabPane tab={item.category_name} key={item.id}>
                        <DataTable data={posTypes} columns={column} loading={getAllPosTypes.isLoading} pagination={pagination} />
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </Card>
              )}
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default PosTypes;
