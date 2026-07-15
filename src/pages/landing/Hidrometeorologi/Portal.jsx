import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ArticlesService, NewsService } from '@/services';
import { Card, Empty, Skeleton, Typography } from 'antd';
import { CloudRain, Tornado, Wind } from 'lucide-react';
import React from 'react';
import parse from 'html-react-parser';
import dateFormatterID from '@/utils/dateFormatterId';

const Portal = () => {
  const { onUnauthorized } = useAuth();
  const { execute: fetchNews, ...getAllNews } = useAbortableService(NewsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchArticles, ...getAllArticles } = useAbortableService(ArticlesService.getAllInLanding, { onUnauthorized });

  React.useEffect(() => {
    fetchNews({
      page: 1,
      per_page: 999,
      category_slug: 'hidrometerologi'
    });

    fetchArticles({
      page: 1,
      per_page: 999,
      category_slug: 'hidrometerologi'
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
              Hidrometeorologi
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Sistem Pemantauan Cuaca dan Iklim Terpadu untuk Kesiapsiagaan Bencana dan Ketahanan Pangan di Provinsi Gorontalo.</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-12 px-12 py-12">
          <div className="flex w-full flex-col items-center justify-center">
            <Typography.Title level={3}>Parameter Monitoring Hidormeteorologi</Typography.Title>
          </div>
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-blue-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <Wind size={24} className="text-blue-500" />
                <div className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold uppercase text-blue-500">Atmosfer</div>
              </div>
              <p className="text-sm font-bold">Dinamika Atmosfer</p>
              <p className="text-sm">Studi tentang pergerakan massa udara, tekanan, dan kelembapan yang membentuk pola cuaca unik di wilayah ekuatorial Gorontalo.</p>
            </div>
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-green-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <Tornado size={24} className="text-green-500" />
                <div className="rounded-md bg-green-100 px-2 py-1 text-xs font-bold uppercase text-green-500">Siklus</div>
              </div>
              <p className="text-sm font-bold">Siklus Hidrologi</p>
              <p className="text-sm">Interaksi antara atmosfer dan permukaan bumi, termasuk proses evaporasi, kondensasi, dan presipitasi di wilayah DAS.</p>
            </div>
            <div className="col-span-1 flex w-full flex-col gap-y-2 rounded-lg border-l-2 border-teal-500 bg-white p-4">
              <div className="mb-3 inline-flex items-center justify-between">
                <CloudRain size={24} className="text-teal-500" />
                <div className="rounded-md bg-teal-100 px-2 py-1 text-xs font-bold uppercase text-teal-500">Cuaca</div>
              </div>
              <p className="text-sm font-bold">Cuaca Ekstrem</p>
              <p className="text-sm">Monitoring intensif fenomena anomali seperti hujan lebat persisten yang berpotensi memicu banjir bandang dan longsor.</p>
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
                  <Card key={item.id} hoverable className="w-full max-w-[280px]" cover={<img src={item.thumbnails?.[0]?.thumbnail ?? item.thumbnail} className="h-52 object-cover" />}>
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
