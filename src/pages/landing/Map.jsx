/* eslint-disable react/prop-types */
import { useCrudModal, useService } from '@/hooks';
import { MapsService } from '@/services';
import { BASE_URL } from '@/utils/api';
import { AimOutlined, InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Skeleton, Typography } from 'antd';
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { getLeafletIcon } from '@/utils/getLeafletIcon';

const Map = () => {
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { execute, ...getAllMaps } = useService(MapsService.getByKategori);
  const [selectedLayers, setSelectedLayers] = React.useState({});
  const [loadingLayers, setLoadingLayers] = React.useState({});

  const fetchMaps = React.useCallback(() => {
    execute();
  }, [execute]);

  React.useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const maps = React.useMemo(() => getAllMaps.data ?? [], [getAllMaps.data]);

  const handleToggleLayer = async (pemetaan) => {
    const id = pemetaan.id;

    if (selectedLayers[id]) {
      const updated = { ...selectedLayers };
      delete updated[id];
      setSelectedLayers(updated);
      return;
    }

    setLoadingLayers((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(BASE_URL + `/landing/pemetaan/${id}/geojson`);
      const json = await res.json();

      setSelectedLayers((prev) => ({
        ...prev,
        [id]: { id, data: json, marker: pemetaan.marker ?? null }
      }));
    } catch (e) {
      console.error('Gagal mengambil GeoJSON:', e);
    } finally {
      setLoadingLayers((prev) => ({ ...prev, [id]: false }));
    }
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.on('click', () => {
        const dataForModal = Object.entries(feature.properties).map(([key, value]) => ({
          key: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          children: String(value)
        }));

        modal.show.description({
          title: feature.properties.name || feature.properties.nama || 'Detail Fitur GeoJSON',
          data: dataForModal
        });
      });

      // Opsional: Tambahkan tooltip sederhana untuk identifikasi fitur saat di-hover
      if (feature.properties.name || feature.properties.nama) {
        layer.bindTooltip(feature.properties.name || feature.properties.nama);
      }
    }
  };

  const getFeatureStyle = (feature) => {
    const props = feature.properties;
    if (!props.fill) {
      return {
        color: '#0000ff',
        weight: 3,
        fillOpacity: 0.3,
        fillColor: '#ffffff'
      };
    }

    return {
      color: props.stroke,
      weight: props['stroke-width'],
      opacity: props['stroke-opacity'],
      fillColor: props.fill,
      fillOpacity: props['fill-opacity']
    };
  };

  return (
    <section className="flex h-screen w-full">
      <div className="h-full w-full flex-[3]">
        <MapContainer center={[0.5412, 123.0595]} zoom={9} className="h-screen w-full">
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.values(selectedLayers).map((layer) => (
            <GeoJSON
              key={layer.id}
              data={layer.data}
              style={getFeatureStyle}
              pointToLayer={(feature, latlng) => {
                // kalau pemetaan punya marker → pakai icon
                if (layer.marker) {
                  const icon = getLeafletIcon(layer.marker);
                  return L.marker(latlng, { icon });
                }

                // default marker
                return L.marker(latlng);
              }}
              onEachFeature={onEachFeature}
            />
          ))}
        </MapContainer>
      </div>
      <div className="flex h-full w-full flex-[1] flex-col gap-y-4 overflow-y-auto bg-white p-8">
        <div className="inline-flex items-center justify-between">
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
        {getAllMaps.isLoading ? (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <div className="mt-4 flex flex-col gap-y-4">
                <Collapse ghost expandIcon={() => ''}>
                  <Collapse.Panel
                    header={
                      <div className="inline-flex w-full items-center justify-between">
                        <div className="inline-flex w-full items-center gap-x-4">
                          <div className="flex items-center justify-center rounded-md bg-blue-100 p-3">
                            <AimOutlined className="text-blue-500" />
                          </div>
                          <Skeleton.Input size="small" active />
                        </div>
                        <MenuOutlined />
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-y-2 px-4">
                      <Checkbox>
                        <Skeleton.Input size="small" active />
                      </Checkbox>
                      <Checkbox>
                        <Skeleton.Input size="small" active />
                      </Checkbox>
                      <Checkbox>
                        <Skeleton.Input size="small" active />
                      </Checkbox>
                      <Checkbox>
                        <Skeleton.Input size="small" active />
                      </Checkbox>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-8">
            {maps.map((item) => (
              <div key={item.id} className="flex flex-col gap-y-2">
                <div className="mt-4 flex flex-col gap-y-4">
                  <Collapse ghost expandIcon={() => ''}>
                    <Collapse.Panel
                      header={
                        <div className="inline-flex w-full items-center justify-between">
                          <div className="inline-flex w-full items-center gap-x-4">
                            <div className="flex items-center justify-center rounded-md bg-blue-100 p-3">
                              <AimOutlined className="text-blue-500" />
                            </div>
                            {item.nama_kategori}
                          </div>
                          <MenuOutlined />
                        </div>
                      }
                    >
                      <div className="flex flex-col gap-y-2 px-4">
                        {item.pemetaan.map((pemetaan) => (
                          <Checkbox key={pemetaan.id} onChange={() => handleToggleLayer(pemetaan)}>
                            <span className="inline-flex items-center gap-x-2">
                              {pemetaan.nama_pemetaan}

                              {loadingLayers[pemetaan.id] && <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></span>}
                              <Button
                                icon={<InfoCircleOutlined />}
                                type="link"
                                onClick={() => {
                                  modal.show.description({
                                    title: pemetaan.nama_pemetaan,
                                    data: [
                                      {
                                        key: 'name',
                                        label: `Nama Pemetaan`,
                                        children: pemetaan.nama_pemetaan
                                      },
                                      {
                                        key: 'name',
                                        label: `Deskripsi`,
                                        children: pemetaan.deskripsi
                                      },
                                      {
                                        key: 'jenis',
                                        label: `Jenis`,
                                        children: pemetaan.jenis
                                      }
                                    ]
                                  });
                                }}
                              />
                            </span>
                          </Checkbox>
                        ))}
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Map;
