import { DataTable } from '@/components';
import { useAuth, usePagination } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { CategoriesService, PosTypesService } from '@/services';
import { DatabaseOutlined } from '@ant-design/icons';
import { Button, Card, Skeleton, Space, Tabs, Tooltip, Typography } from 'antd';
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
    if (activeTab !== null) {
      fetchPosTypes({
        page: pagination.page,
        per_page: pagination.perPage,
        kategori_id: activeTab
      });
    }
  }, [activeTab, pagination.page, pagination.perPage, fetchPosTypes]);

  const posTypes = getAllPosTypes.data ?? [];

  const column = [
    {
      title: 'Nama',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      searchable: true
    },
    {
      title: 'Kewenangan',
      dataIndex: 'authority',
      sorter: (a, b) => a.authority.length - b.authority.length,
      searchable: true
    },
    {
      title: 'Kategori',
      dataIndex: ['id_kategori', 'category_name'],
      sorter: (a, b) => a.id_kategori.category_name.length - b.id_kategori.category_name.length,
      searchable: true
    },
    {
      title: 'Aksi',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ps Pengamatan">
            <Button icon={<DatabaseOutlined />} variant="outlined" color="primary" onClick={() => navigte('/pos_pengamatan/' + record.id)}>
              Pos Pengamatan
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <>
      <section
        style={{
          backgroundImage: "url('/image_asset/background/pos_pengamatan_bg.jpeg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 py-20 pt-48">
          <div className="w-full">
            <Typography.Title level={2} className="uppercase" style={{ color: '#fff' }}>
              Jenis Pos
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Informasi Pos Pengamatan SIH3</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 pt-12">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-32">
          <div className="">
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
          </div>
        </div>
      </section>
    </>
  );
};

export default PosTypes;
