import { DependentSelect } from '@/components/dashboard/input';
import { useAuth, useNotification } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { CategoriesService, ObservationPosService, PosTypesService, TelemetryCoordinatesService } from '@/services';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Select, Typography } from 'antd';
import React from 'react';
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';

const PosTypes = () => {
  const { onUnauthorized } = useAuth();
  const [form] = Form.useForm();
  const { success, error } = useNotification();

  const { execute: fetchCategories, ...getAllCategories } = useAbortableService(CategoriesService.getAllInLanding, { onUnauthorized });

  const { execute: fetchPosTypes, ...getAllPosTypes } = useAbortableService(PosTypesService.getAllInLanding, { onUnauthorized });

  const { execute: fetchObservationPos, ...getAllObservationPos } = useAbortableService(ObservationPosService.getAllInLanding, { onUnauthorized });

  const browseTelemetryCoordinates = useAbortableService(TelemetryCoordinatesService.getAllInLanding, { onUnauthorized });

  const [telemetryCoordinates, setTelemetryCoordinates] = React.useState([]);

  // Fetch kategori awal
  React.useEffect(() => {
    fetchCategories({});
  }, [fetchCategories]);

  const handleSubmitForm = async (values) => {
    const { message, isSuccess, data } = await browseTelemetryCoordinates.execute({
      pos_pengamatan_id: values.observation_pos_id,
      tanggal_akhir: dayjs(values.tanggal_akhir).format('YYYY-MM-DD'),
      tanggal_mulai: dayjs(values.tanggal_mulai).format('YYYY-MM-DD')
    });
    if (isSuccess) {
      success('Berhasil', message);
      setTelemetryCoordinates(data);
      console.log(data);
    } else {
      error('Gagal', message);
    }
    return isSuccess;
  };

  const chartData = telemetryCoordinates
    .filter((item) => item && item.date && item.time && item.rating != null) // 1. buang data null
    .map((item) => ({
      id: item.id,
      datetime: `${item.date} ${item.time}`, // 2. gabung date & time
      date: item.date, // 3. simpan date saja
      time: item.time,
      rating: Number(item.rating), // 4. pastikan number
      color: item.color || '#1677ff' // 5. fallback color
    }))
    // 6. sort urut tanggal agar chart tidak bingung
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const config = {
    data: chartData,
    xField: 'datetime',
    yField: 'rating',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle'
    },
    tooltip: {
      showMarkers: true,
      formatter: (item) => ({
        name: 'Rating',
        value: item.rating
      })
    },
    xAxis: {
      type: 'cat',
      label: {
        autoRotate: false,
        formatter: (v) => v.split(' ')[0] // hanya tanggal
      }
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`
      }
    },
    height: 300,
    autoFit: true
  };

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
              Koordinat Telemetri
            </Typography.Title>
            <Typography.Text style={{ color: '#fff' }}>Informasi Koordinat Telemetri SIH3</Typography.Text>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 pt-12">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-2 px-6 pb-32">
          <div className="">
            <div className="flex flex-wrap items-start justify-center gap-4 pt-12">
              <Card className="w-full">
                <Form
                  form={form}
                  onFinish={handleSubmitForm}
                  layout="vertical"
                  onValuesChange={(changedValues) => {
                    // Jika kategori berubah → reset semua dependent
                    if (changedValues.category_id) {
                      const categoryId = changedValues.category_id;

                      form.setFieldsValue({
                        pos_type_id: undefined,
                        observation_pos_id: undefined
                      });

                      fetchPosTypes({ kategori_id: categoryId });
                    }

                    // Jika pos_type berubah → reset observation + fetch observation
                    if (changedValues.pos_type_id) {
                      const posTypeId = changedValues.pos_type_id;

                      form.setFieldsValue({
                        observation_pos_id: undefined
                      });

                      fetchObservationPos({ jenis_pos_id: posTypeId });
                    }
                  }}
                >
                  <div className="grid w-full grid-cols-5 gap-4">
                    <Form.Item name="category_id" className="col-span-1 m-0">
                      <Select size="large" placeholder="Pilih Kategori">
                        {(getAllCategories.data ?? []).map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.category_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <DependentSelect name="pos_type_id" placeholder="Pilih Jenis Pos" data={getAllPosTypes.data} loading={getAllPosTypes.isLoading} deps={form.getFieldValue('category_id')} labelKey="name" valueKey="id" className="col-span-1 m-0" />
                    <DependentSelect
                      name="observation_pos_id"
                      placeholder="Pilih Pos Pengamatan"
                      data={getAllObservationPos.data}
                      loading={getAllObservationPos.isLoading}
                      deps={form.getFieldValue('pos_type_id')}
                      labelKey="name"
                      valueKey="id"
                      className="col-span-1 m-0"
                    />
                    <Form.Item className="col-span-1 m-0 w-full" name="tanggal_mulai">
                      <DatePicker size="large" placeholder="Pilih Tanggal Mulai" className="w-full" />
                    </Form.Item>
                    <Form.Item className="col-span-1 m-0 w-full" name="tanggal_berakhir">
                      <DatePicker size="large" placeholder="Pilih Tanggal Berakhir" className="w-full" />
                    </Form.Item>

                    <Form.Item className="col-span-5 m-0 w-full">
                      <Button disabled={!form.getFieldValue('observation_pos_id')} className="w-full" size="large" variant="solid" color="primary" icon={<SearchOutlined />} htmlType="submit" loading={browseTelemetryCoordinates.isLoading}>
                        Tampilkan
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </Card>
              {!telemetryCoordinates.length ? (
                <div />
              ) : (
                <Card className="mt-2 w-full">
                  <Line {...config} />
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
