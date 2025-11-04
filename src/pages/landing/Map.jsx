import { AimOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Divider, Typography } from 'antd';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const Map = () => {
  const navigate = useNavigate();
  return (
    <section className="flex h-screen w-full">
      <div className="h-full w-full flex-[3]">
        <MapContainer center={[0.5412, 123.0595]} zoom={9} className="h-screen w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
      <div className="flex h-full w-full flex-[1] flex-col gap-y-4 overflow-y-auto bg-white p-8">
        <div className="mb-8 inline-flex items-center justify-between">
          <div className="flex flex-col">
            <Typography.Title level={5} style={{ margin: 0 }}>
              Geospasial
            </Typography.Title>
            <p className="text-sm">Tampilan Map</p>
          </div>
          <Button variant="solid" color="primary" shape="round" onClick={() => navigate('/')}>
            Ke Beranda
          </Button>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-2">
            <Typography.Title level={5} style={{ margin: 0 }} className="mb-2">
              Hidrologi
            </Typography.Title>
            <Divider dashed style={{ margin: 0 }} />
            <div className="mt-4 flex flex-col gap-y-4">
              <Collapse ghost expandIcon={() => ''}>
                <Collapse.Panel
                  header={
                    <div className="inline-flex w-full items-center justify-between">
                      <div className="inline-flex w-full items-center gap-x-4">
                        <div className="flex items-center justify-center rounded-md bg-blue-100 p-3">
                          <AimOutlined className="text-blue-500" />
                        </div>
                        Peta Titik
                      </div>
                      <MenuOutlined />
                    </div>
                  }
                >
                  <div className="flex flex-col gap-y-2 px-4">
                    <Checkbox>Peta Sebaran Wilayah </Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                  </div>
                </Collapse.Panel>
                <Collapse.Panel
                  header={
                    <div className="inline-flex w-full items-center justify-between">
                      <div className="inline-flex w-full items-center gap-x-4">
                        <div className="flex items-center justify-center rounded-md bg-blue-100 p-3">
                          <AimOutlined className="text-blue-500" />
                        </div>
                        Peta Titik
                      </div>
                      <MenuOutlined />
                    </div>
                  }
                >
                  <div className="flex flex-col gap-y-2 px-4">
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                    <Checkbox>Peta Pemberian Sedekah</Checkbox>
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
