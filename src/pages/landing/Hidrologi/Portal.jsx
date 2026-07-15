import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ArticlesService, NewsService } from '@/services';
import { Card, Empty, Skeleton, Typography } from 'antd';
import { Cloud, CloudRain, Droplet, FlaskConical, Gauge, IndentIncrease, Ruler, Waves } from 'lucide-react';
import React from 'react';
import parse from 'html-react-parser';
import dateFormatterID from '@/utils/dateFormatterId';
import { useNavigate } from 'react-router-dom';

const Portal = () => {
  const { onUnauthorized } = useAuth();
  const navigate = useNavigate();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchArticles, ...getAllArticles } = useAbortableService(ArticlesService.getAllInLanding, { onUnauthorized });

  React.useEffect(() => {
    fetchNews({
      page: 1,
      per_page: 999,
      category_slug: 'hidrologi'
    });

    fetchArticles({
      page: 1,
      per_page: 999,
      category_slug: 'hidrologi'
    });
  }, [fetchNews, fetchArticles]);

  const mergedData = React.useMemo(() => {
    const news = (getAllNews.data ?? []).map((item) => ({
      ...item,
      type: 'berita'
    }));

    const articles = (getAllArticles.data ?? []).map((item) => ({
      ...item,
      type: 'informasi teknis'
    }));

    return [...news, ...articles].sort((a, b) => b.title.localeCompare(a.title));
  }, [getAllNews.data, getAllArticles.data]);

  const onClickHandler = (item) => {
    if (item.type === 'berita') {
      navigate('/news/hidrologi/' + item.slug);
    } else if (item.type === 'informasi teknis') {
      navigate('/article/hidrologi/' + item.slug);
    }
  };

  return (
    <>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/legal_products_bg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 py-20 pt-48">
          <div className="w-full max-w-sm">
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              Hidrologi
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Sistem Pemantauan dan Analisis Siklus Air Terpadu untuk Pengelolaan Sumber Daya Air yang Berkelanjutan di Provinsi Gorontalo.</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-center gap-x-12 px-12 py-12">
          <div className="flex w-full flex-col gap-y-6">
            <Typography.Title level={3}>Apa Itu Hidrologi?</Typography.Title>
            <p>Hidrologi mempelajari pergerakan, distribusi, dan kualitas air di seluruh bumi. Di Provinsi Gorontalo, pemantauan ini krusial untuk mitigasi bencana dan pengelolaan sumber daya air.</p>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="col-span-1 flex gap-3 rounded-md bg-gray-100 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Droplet size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Presipitasi</p>
                  <span className="break-all text-sm text-gray-600">Pemantauan curah hujan di wilayah hulu.</span>
                </div>
              </div>
              <div className="col-span-1 flex gap-3 rounded-md bg-gray-100 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Cloud size={18} className="text-green-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Evaporasi</p>
                  <span className="break-all text-sm text-gray-600">Proses penguapan air kembali ke atmosfer.</span>
                </div>
              </div>
              <div className="col-span-1 flex gap-3 rounded-md bg-gray-100 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                  <Waves size={18} className="text-teal-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Infiltrasi</p>
                  <span className="break-all text-sm text-gray-600">Penyerapan air ke dalam lapisan tanah.</span>
                </div>
              </div>
              <div className="col-span-1 flex gap-3 rounded-md bg-gray-100 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <IndentIncrease size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">Runoff</p>
                  <span className="break-all text-sm text-gray-600">Aliran air permukaan menuju sungai.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <img src="/image_asset/background/hidrologi_reference.png" alt="Hidrologi Reference" className="rounded-md" />
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-12 px-12 py-12">
          <div className="flex w-full max-w-md flex-col gap-y-2">
            <Typography.Title level={3}>Wilayah Sungai Utama</Typography.Title>
            <p>Eksplorasi Daerah Aliran Sungai (DAS) strategis yang dikelola melalui sistem pemantauan terpadu SIH3.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div
              style={{
                backgroundImage: "url('/image_asset/background/das_limboto_reference.jpg')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'multiply'
              }}
              className="relative col-span-1 min-h-96 w-full rounded-lg"
            >
              <div className="absolute left-0 top-0 flex h-full w-full items-end rounded-lg bg-gradient-to-t from-black/80 via-black/10 to-transparent text-white">
                <div className="flex flex-col gap-y-2 p-6">
                  <p className="text-sm font-bold">DAS Limboto</p>
                  <span className="text-xs text-white/80">Menyuplai air ke Danau Limboto dengan tantangan sedimentasi yang tinggi.</span>
                  <hr className="my-2" />
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Luas Wilayah</span>
                      <p className="text-sm font-bold">
                        890 km<sup>2</sup>
                      </p>
                    </div>
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Titik Pantau</span>
                      <p className="text-sm font-bold">12 Stasiun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: "url('/image_asset/background/das_randangan_reference.jpg')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'multiply'
              }}
              className="relative col-span-1 min-h-96 w-full rounded-lg"
            >
              <div className="absolute left-0 top-0 flex h-full w-full items-end rounded-lg bg-gradient-to-t from-black/80 via-black/10 to-transparent text-white">
                <div className="flex flex-col gap-y-2 p-6">
                  <p className="text-sm font-bold">DAS Randangan</p>
                  <span className="text-xs text-white/80">Tulang punggung irigasi pertanian terbesar di wilayah barat provinsi.</span>
                  <hr className="my-2" />
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Luas Wilayah</span>
                      <p className="text-sm font-bold">
                        2,400 km<sup>2</sup>
                      </p>
                    </div>
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Titik Pantau</span>
                      <p className="text-sm font-bold">15 Stasiun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: "url('/image_asset/background/das_bonebolango_reference.jpg')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'multiply'
              }}
              className="relative col-span-1 min-h-96 w-full rounded-lg"
            >
              <div className="absolute left-0 top-0 flex h-full w-full items-end rounded-lg bg-gradient-to-t from-black/80 via-black/10 to-transparent text-white">
                <div className="flex flex-col gap-y-2 p-6">
                  <p className="text-sm font-bold">DAS Bonebolango</p>
                  <span className="text-xs text-white/80">Sumber air baku utama Kota Gorontalo dengan potensi energi hidro.</span>
                  <hr className="my-2" />
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Luas Wilayah</span>
                      <p className="text-sm font-bold">
                        1,250 km<sup>2</sup>
                      </p>
                    </div>
                    <div className="flex w-full flex-col">
                      <span className="text-xs font-bold text-white/80">Titik Pantau</span>
                      <p className="text-sm font-bold">18 Stasiun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-12 py-12">
          <div className="flex w-full flex-col items-center justify-center">
            <Typography.Title level={3}>Parameter Monitoring Hidrologi</Typography.Title>
            <p className="text-center">Data yang dikumpulkan dari 45+ stasiun telemetri di seluruh provinsi</p>
          </div>
          <div className="grid w-full grid-cols-4 gap-4">
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-blue-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <Ruler size={24} className="text-blue-500" />
                <div className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold uppercase text-blue-500">TMA</div>
              </div>
              <p className="text-sm font-bold">Tinggi Muka Air</p>
              <p className="text-sm">Pengukuran vertikal permukaan air sungai secara berkala dalam satuan meter.</p>
            </div>
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-green-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <Gauge size={24} className="text-green-500" />
                <div className="rounded-md bg-green-100 px-2 py-1 text-xs font-bold uppercase text-green-500">Debit</div>
              </div>
              <p className="text-sm font-bold">Debit Air</p>
              <p className="text-sm">Laju aliran volume air yang melewati penampang sungai per satuan waktu (m³/s).</p>
            </div>
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-teal-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <CloudRain size={24} className="text-teal-500" />
                <div className="rounded-md bg-teal-100 px-2 py-1 text-xs font-bold uppercase text-teal-500">Curah Hujan</div>
              </div>
              <p className="text-sm font-bold">Intensitas Hujan</p>
              <p className="text-sm">Jumlah air hujan yang jatuh di satu wilayah dalam durasi tertentu (mm).</p>
            </div>
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-gray-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <FlaskConical size={24} className="text-gray-500" />
                <div className="rounded-md bg-gray-100 px-2 py-1 text-xs font-bold uppercase text-gray-500">Kualitas</div>
              </div>
              <p className="text-sm font-bold">Kualitas Air</p>
              <p className="text-sm">Parameter fisik, kimia, dan biologi air sungai untuk standar baku mutu.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-12 px-12 py-12">
          <div className="flex w-full flex-col">
            <Typography.Title level={3}>Informasi dan Publikasi</Typography.Title>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-4">
            {getAllArticles.isLoading || getAllNews.isLoading ? (
              Array.from({ length: 4 }, (_, i) => i).map((index) => (
                <Card className="w-full max-w-[280px]" key={index}>
                  <Skeleton active />
                </Card>
              ))
            ) : (
              <>
                {!mergedData.length && <Empty styles={{ image: { height: 60 } }} description={<Typography.Text>Belum ada data publikasi yang tersedia</Typography.Text>}></Empty>}
                {mergedData?.map((item) => (
                  <Card onClick={() => onClickHandler(item)} key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnails?.[0]?.thumbnail ?? item.thumbnail} className="h-52 object-cover" />}>
                    <div className="text-gray-500">
                      <span className={`rounded-lg px-2 py-1 text-sm uppercase ${item.type === 'berita' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{item.type}</span>
                      <Typography.Title level={5} className="mt-4">
                        <span className="news-text">{item.title}</span>
                      </Typography.Title>
                      <p className="news-text mb-4">{parse(item.content)}</p>
                      <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Portal;
