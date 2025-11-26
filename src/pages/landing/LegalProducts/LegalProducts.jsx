import { DataTable, DataTableHeader } from '@/components';
import Modul from '@/constants/Modul';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { LegalProductsService } from '@/services';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton, Space, Tooltip, Typography } from 'antd';
import React from 'react';

const LegalProducts = () => {
  const { onUnauthorized } = useAuth();
  const { execute, ...getAllLegalProducts } = useAbortableService(LegalProductsService.getAllInLanding, { onUnauthorized });

  const pagination = usePagination({ totalData: getAllLegalProducts.totalData });
  const [filterValues, setFilterValues] = React.useState({ search: '' });

  const fetchLegalProducts = React.useCallback(() => {
    execute({
      page: pagination.page,
      per_page: pagination.perPage,
      search: filterValues.search
    });
  }, [execute, filterValues.search, pagination.page, pagination.perPage]);

  React.useEffect(() => {
    fetchLegalProducts();
  }, [fetchLegalProducts]);

  const legalProducts = getAllLegalProducts.data ?? [];

  const column = [
    {
      title: 'Judul Produk Hukum',
      dataIndex: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      searchable: true
    },
    {
      title: 'Deskripsi',
      dataIndex: 'desc',
      sorter: (a, b) => a.desc.length - b.desc.length,
      searchable: true
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
      sorter: (a, b) => a.year.length - b.year.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Unduh Produk Hukum">
            <Button icon={<DownloadOutlined />} variant="outlined" onClick={() => window.open(record.file, '_blank')} />
          </Tooltip>
        </Space>
      )
    }
  ];

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
          <div className="w-full">
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              Produk Hukum
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Informasi Produk Hukum SIH3</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 pt-12">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-32">
          <div className="">
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              <Card className="w-full">
                <Skeleton className="w-full" loading={getAllLegalProducts.isLoading}>
                  <DataTableHeader modul={Modul.LEGAL_PRODUCTS} onSearch={(values) => setFilterValues({ ...filterValues, search: values })} />
                  <div className="w-full max-w-full overflow-x-auto">
                    <DataTable data={legalProducts} columns={column} loading={getAllLegalProducts.isLoading} pagination={pagination} />
                  </div>
                </Skeleton>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalProducts;
