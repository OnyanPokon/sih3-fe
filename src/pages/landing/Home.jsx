import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { NewsService } from '@/services';
import { CheckCircleFilled, CloudFilled, CompassFilled, EnvironmentFilled } from '@ant-design/icons';
import { Card, Skeleton, Typography } from 'antd';
import React from 'react';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import dateFormatterID from '@/utils/dateFormatterId';

const Home = () => {
  const navigte = useNavigate();
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });

  React.useEffect(() => {
    fetchNews({ page: 1, per_page: 4 });
  }, [fetchNews]);

  const news = getAllNews.data ?? [];

  return (
    <>
      <section
        className=""
        style={{
          backgroundImage: "url('/image_asset/background/hero_bg.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center gap-x-10 px-6 py-28 text-white">
          <div className="flex max-w-2xl flex-col items-center gap-y-4 text-center">
            <Typography.Title style={{ margin: 0, color: '#fff' }}>Sistem Informasi Hidrologi, Hidrometerologi, dan Hidrogeologi Provinsi Gorontalo</Typography.Title>
            <p className="mb-6 max-w-lg text-sm text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
            <div className="flex items-center justify-center gap-x-8">
              <Card className="[&_.ant-card-body]:!p-2">
                <img src="/image_asset/logo/prov_gto_logo.png" className="h-12 w-12 object-cover" loading="lazy" />
              </Card>
              <Card className="[&_.ant-card-body]:!p-2">
                <img src="/image_asset/logo/pupr_logo.png" className="h-12 w-12 object-cover" loading="lazy" />
              </Card>
              <Card className="[&_.ant-card-body]:!p-2">
                <img src="/image_asset/logo/bmkg_logo.png" className="h-12 w-12 object-cover" loading="lazy" />
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/h3_section_bg.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className="-translate-y-9 rounded-t-3xl bg-white"
      >
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-28 px-6 py-28">
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-green-100 p-4 text-green-500">
              <CloudFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrologi
            </Typography.Title>
            <small className="text-gray-500">Kajian aliran dan ketersediaan air di permukaan, interaksi dengan air hujan serta air tanah, untuk mendukung perencanaan sumber daya air yang berkelanjutan.</small>
          </div>
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-yellow-100 p-4 text-yellow-500">
              <CompassFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrometerologi
            </Typography.Title>
            <small className="text-gray-500">Pemantauan dan analisis hujan serta fenomena atmosfer yang memengaruhi debit sungai, banjir, dan ketersediaan air di berbagai wilayah.</small>
          </div>
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-100 p-4 text-blue-500">
              <EnvironmentFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrogeologi
            </Typography.Title>
            <small className="text-gray-500">Studi air bawah tanah pada zona jenuh, dinamika akuifer, serta keterkaitannya dengan air permukaan untuk pemenuhan kebutuhan air bersih.</small>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-40 px-6 py-16">
          <div className="flex w-full flex-col gap-y-4">
            <Typography.Title level={3} style={{ margin: 0 }}>
              Tentang Website SIH³
            </Typography.Title>
            <p className="mb-8 text-gray-500">
              Website SIH³ (Sistem Informasi Hidrologi, Hidrogeologi, dan Hidrometeorologi) merupakan platform digital yang dikembangkan untuk menyediakan data dan informasi terkait kondisi sumber daya air, curah hujan, dan potensi bencana di
              Provinsi Gorontalo.
            </p>
            <div className="relative rounded-xl bg-white p-6 text-sm">
              <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-blue-500 p-3">
                <img src="/image_asset/logo/prov_gto_logo.png" />
              </div>
              Sistem ini bertujuan mendukung pengelolaan sumber daya air yang berkelanjutan, membantu pengambilan keputusan berbasis data, serta meningkatkan kesadaran masyarakat terhadap pentingnya menjaga keseimbangan lingkungan dan ekosistem air
              di Gorontalo.
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-4 rounded-xl bg-white p-8">
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Pusat data hidrologi, hidrogeologi, dan hidrometeorologi Gorontalo.</span>
            </div>
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Informasi cuaca dan curah hujan terkini.</span>
            </div>
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Pemantauan potensi banjir dan kekeringan.</span>
            </div>
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Dukungan untuk kebijakan dan riset lingkungan.</span>
            </div>
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Visualisasi data interaktif dan mudah dipahami.</span>
            </div>
            <div className="inline-flex items-start gap-x-2">
              <CheckCircleFilled className="mt-1.5 text-green-500" />
              <span>Kolaborasi antarinstansi dan masyarakat.</span>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/hidrologi_bg.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className="bg-gray-50"
      >
        <div className="mx-auto max-w-screen-xl items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
          <div className="font-light">
            <Typography.Title level={3}>Portal Berita</Typography.Title>
            <p className="mb-4 text-gray-500">
              Portal Berita SIH³ merupakan pusat informasi seputar hidrologi, hidrogeologi, dan hidrometeorologi di Provinsi Gorontalo. Melalui portal ini, masyarakat dan instansi dapat memantau kondisi sumber daya air, iklim, serta potensi bencana
              yang berkaitan dengan air secara akurat dan terupdate.
            </p>
            <p className="mb-4 text-gray-500">
              Kami berupaya menghadirkan berita dan data yang relevan untuk mendukung pengelolaan lingkungan, perencanaan pembangunan, serta peningkatan kesadaran masyarakat terhadap pentingnya keseimbangan ekosistem air.
            </p>
            <div className="flex items-center gap-x-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-green-100 p-4 text-green-500">
                <CloudFilled className="text-4xl" />
              </div>
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-yellow-100 p-4 text-yellow-500">
                <CompassFilled className="text-4xl" />
              </div>
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-blue-100 p-4 text-blue-500">
                <EnvironmentFilled className="text-4xl" />
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <img className="h-full w-full rounded-lg object-cover" src="/image_asset/background/lombongo.jpg" alt="office content 1" />
            <img className="mt-4 h-full w-full rounded-lg object-cover lg:mt-10" src="/image_asset/background/sherly.jpeg" alt="office content 2" />
          </div>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto w-full max-w-screen-xl px-6 pb-32">
          <hr />
          <div className="mt-12 flex w-full items-center justify-center">
            <Typography.Title level={4}>Berita Terkini</Typography.Title>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
            {getAllNews.isLoading
              ? Array.from({ length: 4 }, (_, i) => i).map((index) => (
                  <Card className="w-full max-w-[280px]" key={index}>
                    <Skeleton active />
                  </Card>
                ))
              : news?.map((item) => (
                  <Card onClick={() => navigte(window.location.pathname + 'news/' + item.category_id.slug + '/' + item.slug)} key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnail} className="h-52 object-cover" />}>
                    <div className="text-gray-500">
                      <Typography.Title level={5}>
                        <span className="news-text">{item.title}</span>
                      </Typography.Title>
                      <p className="news-text mb-4">{parse(item.content)}</p>
                      <p className="text-xs">{dateFormatterID(item.created_at)}</p>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
