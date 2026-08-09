import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { NewsService, UnorsService } from '@/services';
import { ArrowRightOutlined, CheckCircleFilled, CompassOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton, Typography } from 'antd';
import React from 'react';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import dateFormatterID from '@/utils/dateFormatterId';
import { ArrowRight, CloudHail, Droplets, Layers2 } from 'lucide-react';
import { getThemeByCategory } from '@/utils/getThemeByCategory';

const Home = () => {
  const navigte = useNavigate();
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchUnors, ...getAllUnors } = useAbortableService(UnorsService.getAllInLanding, { onUnauthorized });

  React.useEffect(() => {
    fetchNews({ page: 1, per_page: 5 });
    fetchUnors({ page: 1, per_page: 999 });
  }, [fetchNews, fetchUnors]);

  const news = getAllNews.data ?? [];
  const unors = getAllUnors.data ?? [];

  return (
    <>
      <section
        className=""
        style={{
          backgroundImage: "url('/image_asset/background/hero_bg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center gap-x-10 px-6 py-28 text-white">
          <div className="flex max-w-2xl flex-col items-center gap-y-4 text-center">
            <div className="flex items-center justify-center gap-x-8">
              {unors.map((item) => (
                <Card key={item.id} className="[&_.ant-card-body]:!p-2">
                  <img src={item.logo} className="h-12 w-12 object-cover" loading="lazy" />
                </Card>
              ))}
            </div>
            <Typography.Title style={{ margin: 0, color: '#fff' }}>Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi Provinsi Gorontalo</Typography.Title>
            <p className="mb-6 max-w-lg text-sm text-white">Platform digital terintegrasi untuk pengelolaan data sumber daya air yang presisi, mendukung keberlanjutan ekosistem di wilayah Gorontalo.</p>
            <div className="flex items-center justify-center gap-x-8">
              <Button type="primary" size="large" icon={<CompassOutlined />}>
                Jelajahi Data
              </Button>
              <Button size="large">Pelajari Selengkapnya</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-t-3xl bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-8 px-6 py-12">
          <div onClick={() => navigte('/portal/hidrologi')} className="group relative cursor-pointer overflow-hidden rounded-xl border-t-4 border-blue-500 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-50/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative z-10 flex flex-col gap-y-4">
              <div className="w-fit rounded-lg bg-blue-100 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                <Droplets size={28} className="text-blue-500 transition-colors duration-300 group-hover:text-white" />
              </div>

              <Typography.Title level={4} style={{ margin: 0 }} className="font-bold transition-colors duration-300 group-hover:text-blue-600">
                Hidrologi
              </Typography.Title>

              <small className="max-w-xs text-gray-500">Kajian aliran dan ketersediaan air di permukaan, interaksi dengan air hujan serta air tanah, untuk mendukung perencanaan sumber daya air yang berkelanjutan.</small>
              <hr />
              <small className="inline-flex items-center gap-x-2 transition-colors group-hover:text-blue-500">
                Lihat Portal Hidrologi <ArrowRight size={12} />
              </small>
            </div>
            <div className="absolute -right-16 -top-16 h-40 w-40 scale-0 rounded-full bg-blue-100/40 transition-transform duration-500 group-hover:scale-100" />
          </div>
          <div onClick={() => navigte('/portal/hidrometeorologi')} className="group relative cursor-pointer overflow-hidden rounded-xl border-t-4 border-green-500 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-green-50/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative z-10 flex flex-col gap-y-4">
              <div className="w-fit rounded-lg bg-green-100 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500">
                <CloudHail size={28} className="text-green-500 transition-colors duration-300 group-hover:text-white" />
              </div>

              <Typography.Title level={4} style={{ margin: 0 }} className="font-bold transition-colors duration-300 group-hover:text-green-600">
                Hidrometeorologi
              </Typography.Title>

              <small className="max-w-xs text-gray-500">Pemantauan dan analisis hujan serta fenomena atmosfer yang memengaruhi debit sungai, banjir, dan ketersediaan air di berbagai wilayah.</small>
              <hr />
              <small className="inline-flex items-center gap-x-2 transition-colors group-hover:text-green-500">
                Lihat Portal Hidrometeorologi <ArrowRight size={12} />
              </small>
            </div>
            <div className="absolute -right-16 -top-16 h-40 w-40 scale-0 rounded-full bg-green-100/40 transition-transform duration-500 group-hover:scale-100" />
          </div>
          <div onClick={() => navigte('/portal/hidrogeologi')} className="group relative cursor-pointer overflow-hidden rounded-xl border-t-4 border-amber-500 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-50/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative z-10 flex flex-col gap-y-4">
              <div className="w-fit rounded-lg bg-amber-100 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500">
                <Layers2 size={28} className="text-amber-500 transition-colors duration-300 group-hover:text-white" />
              </div>

              <Typography.Title level={4} style={{ margin: 0 }} className="font-bold transition-colors duration-300 group-hover:text-amber-600">
                Hidrogeologi
              </Typography.Title>

              <small className="max-w-xs text-gray-500">Studi air bawah tanah pada zona jenuh, dinamika akuifer, serta keterkaitannya dengan air permukaan untuk pemenuhan kebutuhan air bersih.</small>
              <hr />
              <small className="inline-flex items-center gap-x-2 transition-colors group-hover:text-amber-500">
                Lihat Portal Hidrogeologi <ArrowRight size={12} />
              </small>
            </div>
            <div className="absolute -right-16 -top-16 h-40 w-40 scale-0 rounded-full bg-amber-100/40 transition-transform duration-500 group-hover:scale-100" />
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-40 px-6 py-16">
          <div className="flex w-full flex-col gap-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">TENTANG SIH3 - PROVINSI GORONTALO</span>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Platform Digital Pengelolaan Sumber Daya Air Terpadu
            </Typography.Title>
            <p className="text-sm text-gray-500">
              Website SIH3 (Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi) merupakan platform digital yang dikembangkan untuk menyediakan data dan informasi terkait kondisi sumber daya air, curah hujan, dan potensi bencana di
              Provinsi Gorontalo.
            </p>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="col-span-1 inline-flex items-center gap-x-2">
                <CheckCircleFilled className="mt-0.5 text-blue-500" />
                <span className="text-sm">Visualisasi Data Interaktif</span>
              </div>
              <div className="col-span-1 inline-flex items-center gap-x-2">
                <CheckCircleFilled className="mt-0.5 text-blue-500" />
                <span className="text-sm">Laporan Terintegrasi</span>
              </div>
              <div className="col-span-1 inline-flex items-center gap-x-2">
                <CheckCircleFilled className="mt-0.5 text-blue-500" />
                <span className="text-sm">Pemantauan Real-Time</span>
              </div>
              <div className="col-span-1 inline-flex items-center gap-x-2">
                <CheckCircleFilled className="mt-0.5 text-blue-500" />
                <span className="text-sm">Analisis Ahli</span>
              </div>
            </div>
            <Button className="w-fit" size="large" type="primary">
              Baca Selengkapnya
            </Button>
          </div>
          <div className="flex h-[400px] w-full gap-4">
            {/* Kiri */}
            <div className="flex flex-[2] flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-xl">
                <img src="/image_asset/background/lombongo.jpg" className="h-full w-full object-cover transition duration-700 hover:scale-110" />
              </div>
              <div className="flex h-20 items-center gap-x-4 rounded-xl bg-blue-500 px-4 text-white">
                <div className="w-fit rounded-lg bg-white p-3 transition-all duration-300">
                  <Droplets size={28} className="text-blue-500 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="">
                  <h2 className="text-xl font-bold">15+</h2>
                  <p className="text-xs tracking-widest">Stasiun Telemetri</p>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-xl">
                <img src="/image_asset/background/sherly.jpeg" className="h-full w-full object-cover transition duration-700 hover:scale-110" />
              </div>

              <div className="flex-1 overflow-hidden rounded-xl">
                <img src="/image_asset/background/embun.jpg" className="h-full w-full object-cover transition duration-700 hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
          <div className="inline-flex w-full items-center justify-between">
            <div className="flex w-full flex-col justify-center gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">PUSAT INFORMASI</span>
              <Typography.Title level={4}>Berita Terkini & Publikasi</Typography.Title>
            </div>
            <Button icon={<ArrowRightOutlined />} variant="link" color="primary" iconPosition="end">
              Lihat Semua Berita
            </Button>
          </div>

          <div className="flex flex-wrap items-start justify-around pt-12">
            {getAllNews.isLoading
              ? Array.from({ length: 5 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[230px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : news?.map((item) => {
                  const theme = getThemeByCategory(item.category_id.category_name);
                  return (
                    <Card
                      onClick={() => navigte(window.location.pathname + 'news/' + item.category_id.slug + '/' + item.slug)}
                      key={item.id}
                      hoverable
                      className="w-full max-w-[230px]"
                      cover={
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img src={item.thumbnail} alt={item.title} className="h-32 w-full object-cover" />

                          <span className={`absolute left-3 top-3 rounded-full ${theme.bg} px-3 py-1 text-[8px] font-medium text-white shadow-md`}>{item.category_id.category_name}</span>
                        </div>
                      }
                    >
                      <div className="text-gray-500">
                        <p className="mb-2 text-xs">{dateFormatterID(item.created_at)}</p>
                        <Typography.Title level={5}>
                          <span className="news-text">{item.title}</span>
                        </Typography.Title>
                        <p className="news-text">{parse(item.content)}</p>
                      </div>
                    </Card>
                  );
                })}
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
          <div
            style={{
              backgroundImage: "url('/image_asset/background/peta_card_background.png')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}
            className="flex flex-col gap-y-10 rounded-2xl p-20"
          >
            <Typography.Title style={{ margin: 0, color: '#fff' }} className="max-w-sm">
              Akses Data Spasial Real-time Secara Terbuka
            </Typography.Title>
            <p className="max-w-sm text-sm text-white">Buka portal pemetaan interaktif kami untuk melihat kondisi hidrologi terkini di seluruh penjuru Provinsi Gorontalo.</p>

            <Button className="w-fit" size="large">
              Lihat Peta Interaktif
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
