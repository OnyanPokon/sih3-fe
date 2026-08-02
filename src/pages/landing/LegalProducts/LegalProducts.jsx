import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { LegalProductsService, UnorsService } from '@/services';
import { CustomerServiceOutlined, DownloadOutlined, EyeOutlined, FileOutlined, MailOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Progress, Select, Skeleton, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

const LegalProducts = () => {
  const { onUnauthorized } = useAuth();
  const { execute: fetchLegalProducts, ...getAllLegalProducts } = useAbortableService(LegalProductsService.getAllInLanding, { onUnauthorized });
  const { execute: fetchUnors, ...getAllUnors } = useAbortableService(UnorsService.getAllInLanding, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllLegalProducts.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '', tahun: null, unor_id: null });

  const unors = React.useMemo(() => getAllUnors.data ?? [], [getAllUnors.data]);

  // 🔹 Fetch categories once
  React.useEffect(() => {
    fetchUnors({});
  }, [fetchUnors]);

  React.useEffect(() => {
    fetchLegalProducts({
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search,
      tahun: filterValues.tahun ?? undefined,
      unor_id: filterValues.unor_id ?? undefined,
    });
  }, [fetchLegalProducts, filterValues.search, filterValues.tahun, filterValues.unor_id, pagination.page, pagination.perPage]);

  const legalProducts = getAllLegalProducts.data ?? [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

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
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-md">Produk Hukum</span>
            <Typography.Title level={2} className="mt-4 uppercase" style={{ color: '#fff' }}>
              Produk Hukum
            </Typography.Title>
            <Typography.Text className="max-w-sm" style={{ color: '#fff' }}>
              Akses transparan terhadap dasar hukum, peraturan daerah, dan standar operasional prosedur pengelolaan sumber daya air di Provinsi Gorontalo.
            </Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl items-center gap-x-2 p-6">
          <Input.Search
            allowClear
            onSearch={(values) => setFilterValues((prev) => ({ ...prev, search: values }))}
            size="large"
            placeholder="Cari judul peraturan, deskripsi, atau nomor produk hukum..."
          />
          <Select onChange={(value) => setFilterValues((prev) => ({ ...prev, unor_id: value }))} size="large" placeholder="Tahun" className="w-72" defaultValue="">
            <Select.Option value="">Semua Unor</Select.Option>
            {unors.map((unor) => (
              <Select.Option key={unor.id} value={unor.id}>
                {unor.name}
              </Select.Option>
            ))}
          </Select>
          <Select onChange={(value) => setFilterValues((prev) => ({ ...prev, tahun: value }))} size="large" placeholder="Tahun" className="w-48" defaultValue="">
            <Select.Option value="">Semua Tahun</Select.Option>
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-4 px-12 py-12">
          <div className="inline-flex items-center justify-between">
            <p>
              Menampilkan <span className="font-bold text-blue-500">24 Dokumen</span> Produk Hukum
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-4">
            {getAllLegalProducts.isLoading
              ? Array.from({ length: 3 }, (_, i) => i).map((index) => (
                <Card className="w-full max-w-[382px]" key={index}>
                  <Skeleton active />
                </Card>
              ))
              : legalProducts?.map((item) => {
                return (
                  <Card key={item.id} className="w-full max-w-[382px]">
                    <div className="text-gray-500">
                      <p className="mb-2 text-xs">{item.year}</p>
                      <Typography.Title level={5}>
                        <span className="news-text">{item.title}</span>
                      </Typography.Title>
                      <p className="news-text">{item.desc}</p>
                      <hr className="my-4" />
                      <div className="inline-flex w-full items-center justify-between">
                        <div className="inline-flex items-center gap-x-2">
                          <PaperClipOutlined />
                          <span className="text-xs">PDF</span>
                        </div>
                        <Button variant="text" color="primary" size="small">
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
          <div className="flex gap-x-4">
            <div className="flex w-full flex-[2] gap-x-4 rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 p-4 transition-all duration-300">
                <FileOutlined className="text-xl text-blue-500 transition-colors duration-300" />
              </div>
              <div className="flex flex-col gap-y-4">
                <span className="w-fit rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">Peraturan daerah</span>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Perda No. 12 Tahun 2024 tentang Pengelolaan Terpadu Sumber Daya Air Lintas Kabupaten
                </Typography.Title>
                <p className="text-sm">Mengatur tentang sinkronisasi data hidrologi antara pemerintah provinsi dan kabupaten guna pemantauan debit air di musim kemarau serta sistem peringatan dini banjir.</p>
                <div className="inline-flex items-center gap-x-2">
                  <Button variant="solid" color="primary" icon={<DownloadOutlined />}>
                    Unduh PDF
                  </Button>
                  <Button variant="solid" icon={<EyeOutlined />}>
                    Pertinjau
                  </Button>
                </div>
              </div>
            </div>
            <Card
              style={{
                backgroundImage: "url('/image_asset/background/legal_products_card_bg.png')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }}
              className="h-fit w-full flex-[1]"
            >
              <Typography.Title level={5} style={{ color: '#fff' }}>
                Ringkasan Legal
              </Typography.Title>
              <div className="inline-flex w-full items-center justify-between text-white">
                <span className="text-xs">Total Produk Hukkum</span>
                <span className="text-xs">{pagination.totalData} File</span>
              </div>
              <Progress showInfo={false} percent={80} />
              <p className="text-sm text-white">Semua dokumen telah diverifikasi oleh Biro Hukum Setda Provinsi Gorontalo.</p>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-center gap-x-40 px-6 py-16">
          <div className="flex w-full flex-col gap-y-6">
            <Typography.Title level={2} style={{ margin: 0 }}>
              Belum Menemukan Dokumen?
            </Typography.Title>
            <p className="text-sm text-gray-500">
              Kami terus memperbarui database produk hukum untuk akurasi informasi yang lebih baik. Jika Anda memerlukan salinan fisik atau dokumen spesifik yang tidak tercantum, silakan hubungi pusat layanan informasi kami.
            </p>

            <div className="inline-flex items-center gap-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 p-4 transition-all duration-300">
                <MailOutlined className="text-lg text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold">Email Informasi</p>
                <span className="text-sm">kontak@sih3.gorontaloprov.go.id</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 p-4 transition-all duration-300">
                <CustomerServiceOutlined className="text-lg text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold">Layanan Pelanggan</p>
                <span className="text-sm">kontak@sih3.gorontaloprov.go.id</span>
              </div>
            </div>
          </div>
          <div className="w-full">
            <Card className="w-full" title="Formulir Permohonan Informasi">
              <Form layout="vertical" className="grid grid-cols-2 gap-4">
                <Form.Item name="name" className="col-span-1" style={{ margin: 0 }}>
                  <Input size="large" placeholder="Nama Lengkap" />
                </Form.Item>
                <Form.Item name="name" className="col-span-1" style={{ margin: 0 }}>
                  <Input size="large" placeholder="Nama Lengkap" />
                </Form.Item>
                <Form.Item name="name" className="col-span-2" style={{ margin: 0 }}>
                  <Input size="large" placeholder="Subjek Produk Hukum yang Dicari" />
                </Form.Item>
                <Form.Item name="name" className="col-span-2" style={{ margin: 0 }}>
                  <TextArea size="large" placeholder="Pesan Anda..." />
                </Form.Item>
                <Form.Item name="name" className="col-span-2" style={{ margin: 0 }}>
                  <Button variant="solid" color="primary" size="large" className="w-full">
                    Kirim Permohonan
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalProducts;
