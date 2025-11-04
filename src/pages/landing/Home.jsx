import { CheckCircleFilled, CloudFilled, CompassFilled, EnvironmentFilled } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigte = useNavigate();
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
            <div className="flex w-full items-center justify-center gap-x-2">
              <Button size="large" variant="solid" color="primary" shape="round">
                Berita
              </Button>
              <Button size="large" variant="solid" shape="round" onClick={() => navigte('/pemetaan')}>
                Pemetaan
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="-translate-y-9 rounded-t-3xl bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-28 px-6 py-28">
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-green-100 p-4 text-green-500">
              <CloudFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrogeologi
            </Typography.Title>
            <small>Kajian aliran dan ketersediaan air di permukaan, interaksi dengan air hujan serta air tanah, untuk mendukung perencanaan sumber daya air yang berkelanjutan.</small>
          </div>
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-yellow-100 p-4 text-yellow-500">
              <CompassFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrometerologi
            </Typography.Title>
            <small>Pemantauan dan analisis hujan serta fenomena atmosfer yang memengaruhi debit sungai, banjir, dan ketersediaan air di berbagai wilayah.</small>
          </div>
          <div className="flex max-w-xs flex-col items-center justify-center gap-y-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-100 p-4 text-blue-500">
              <EnvironmentFilled className="text-4xl" />
            </div>
            <Typography.Title level={5} style={{ margin: 0 }} className="font-bold">
              Hidrogeologi
            </Typography.Title>
            <small>Studi air bawah tanah pada zona jenuh, dinamika akuifer, serta keterkaitannya dengan air permukaan untuk pemenuhan kebutuhan air bersih.</small>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl items-start justify-center gap-x-40 px-6 py-16">
          <div className="flex w-full flex-col gap-y-4">
            <Typography.Title level={3} style={{ margin: 0 }}>
              Tentang Website SIH3
            </Typography.Title>
            <p className="mb-8 text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
            <div className="relative rounded-xl bg-gray-100 p-6 text-sm">
              <div className="absolute -right-4 -top-4 h-14 w-14 rounded-full bg-blue-500 p-3">
                <img src="/image_asset/logo/prov_gto_logo.png" />
              </div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-4 rounded-xl bg-gray-100 p-8">
            <div className="inline-flex gap-x-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, </span>
            </div>
            <div className="inline-flex gap-x-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, </span>
            </div>
            <div className="inline-flex gap-x-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, </span>
            </div>
          </div>
        </div>
      </section>
      <section></section>
    </>
  );
};

export default Home;
