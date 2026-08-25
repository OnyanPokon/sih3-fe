/* eslint-disable react/prop-types */
import { useCrudModal, useService } from '@/hooks';
import { MapsService } from '@/services';
import { BASE_URL } from '@/utils/api';
import {
  AimOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  EyeOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  Skeleton,
  Typography,
  Badge,
  Tag,
  Drawer,
  List,
  Card,
  Space,
  Empty,
  Tooltip
} from 'antd';
import React from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { getLeafletIcon } from '@/utils/getLeafletIcon';

const { Title, Text } = Typography;

// Helper component to capture map instance
const MapController = ({ onMapReady }) => {
  const map = useMap();
  React.useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return null;
};

const Map = () => {
  const navigate = useNavigate();
  const modal = useCrudModal();
  const { execute, ...getAllMaps } = useService(MapsService.getByKategori);

  const [selectedLayers, setSelectedLayers] = React.useState({});
  const [loadingLayers, setLoadingLayers] = React.useState({});
  const [searchLayer, setSearchLayer] = React.useState('');
  const [mapInstance, setMapInstance] = React.useState(null);

  // Drawer state for viewing layer feature list
  const [drawerLayer, setDrawerLayer] = React.useState(null);
  const [searchFeature, setSearchFeature] = React.useState('');

  const fetchMaps = React.useCallback(() => {
    execute();
  }, [execute]);

  React.useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const maps = React.useMemo(() => getAllMaps.data ?? [], [getAllMaps.data]);

  // Toggle Layer Selection
  const handleToggleLayer = async (pemetaan) => {
    const id = pemetaan.id;

    if (selectedLayers[id]) {
      const updated = { ...selectedLayers };
      delete updated[id];
      setSelectedLayers(updated);
      if (drawerLayer?.id === id) {
        setDrawerLayer(null);
      }
      return;
    }

    setLoadingLayers((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(BASE_URL + `/landing/pemetaan/${id}/geojson`);
      const json = await res.json();

      setSelectedLayers((prev) => ({
        ...prev,
        [id]: {
          id,
          name: pemetaan.nama_pemetaan,
          geometry: pemetaan.jenis,
          data: json,
          marker: pemetaan.marker ?? null
        }
      }));

      // Auto-fit bounds if map ready
      if (mapInstance && json && json.features && json.features.length > 0) {
        try {
          const tempLayer = L.geoJSON(json);
          const bounds = tempLayer.getBounds();
          if (bounds.isValid()) {
            mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          }
        } catch (e) {
          console.error('Error auto-fitting bounds:', e);
        }
      }
    } catch (e) {
      console.error('Gagal mengambil GeoJSON:', e);
    } finally {
      setLoadingLayers((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Fly to specific feature on map
  const handleFlyToFeature = (feature) => {
    if (!mapInstance) return;

    if (feature.geometry?.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      mapInstance.flyTo([lat, lng], 15, { duration: 1.2 });
    } else {
      try {
        const tempLayer = L.geoJSON(feature);
        const bounds = tempLayer.getBounds();
        if (bounds.isValid()) {
          mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      } catch (e) {
        console.error('Error fitting feature bounds:', e);
      }
    }

    // Open detail description modal
    const name =
      feature.properties?.name ||
      feature.properties?.nama ||
      feature.properties?.NAMA_OBJEK ||
      feature.properties?.NAMA_POS ||
      feature.properties?.KABUPATEN ||
      feature.properties?.title ||
      'Detail Objek Spasial';

    const dataForModal = Object.entries(feature.properties || {}).map(([key, value]) => ({
      key: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      children: String(value)
    }));

    modal.show.description({
      title: name,
      data: dataForModal
    });
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const name =
        feature.properties.name ||
        feature.properties.nama ||
        feature.properties.NAMA_OBJEK ||
        feature.properties.NAMA_POS ||
        feature.properties.KABUPATEN ||
        feature.properties.title ||
        'Objek Spasial';

      const coords = feature.geometry?.type === 'Point' ? feature.geometry.coordinates : null;

      // Rich Tooltip on Hover
      const tooltipContent = `
        <div style="font-family: inherit; min-width: 140px; padding: 2px;">
          <div style="font-weight: 600; color: #1677ff; font-size: 12px; margin-bottom: 2px;">${name}</div>
          ${coords ? `<div style="font-size: 11px; color: #555;">📍 Lat: ${coords[1].toFixed(5)}, Lng: ${coords[0].toFixed(5)}</div>` : ''}
          <div style="font-size: 10px; color: #888; margin-top: 4px;">Klik untuk melihat informasi lengkap</div>
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'top',
        offset: [0, -10],
        opacity: 0.95
      });

      layer.on('click', () => {
        const dataForModal = Object.entries(feature.properties).map(([key, value]) => ({
          key: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          children: String(value)
        }));

        modal.show.description({
          title: name,
          data: dataForModal
        });
      });
    }
  };

  const getFeatureStyle = (feature) => {
    const props = feature.properties || {};
    if (!props.fill && !props.stroke) {
      return {
        color: '#0033cc',
        weight: 3,
        fillOpacity: 0.35,
        fillColor: '#3388ff'
      };
    }

    return {
      color: props.stroke || '#0033cc',
      weight: props['stroke-width'] ?? 3,
      opacity: props['stroke-opacity'] ?? 1,
      fillColor: props.fill || '#3388ff',
      fillOpacity: props['fill-opacity'] ?? 0.35
    };
  };

  // Filter categories and layers by search query
  const filteredMaps = React.useMemo(() => {
    if (!searchLayer.trim()) return maps;
    const query = searchLayer.toLowerCase();
    return maps
      .map((cat) => {
        const matchingPemetaan = (cat.pemetaan || []).filter((p) =>
          p.nama_pemetaan.toLowerCase().includes(query)
        );
        if (cat.nama_kategori.toLowerCase().includes(query)) {
          return cat;
        }
        if (matchingPemetaan.length > 0) {
          return { ...cat, pemetaan: matchingPemetaan };
        }
        return null;
      })
      .filter(Boolean);
  }, [maps, searchLayer]);

  // Total counts
  const totalActiveLayers = Object.keys(selectedLayers).length;
  const totalLoadedFeatures = Object.values(selectedLayers).reduce(
    (acc, l) => acc + (l.data?.features?.length || 0),
    0
  );

  // Drawer feature list filtered by search
  const drawerFeatures = React.useMemo(() => {
    if (!drawerLayer?.data?.features) return [];
    if (!searchFeature.trim()) return drawerLayer.data.features;
    const q = searchFeature.toLowerCase();
    return drawerLayer.data.features.filter((f) => {
      const name =
        f.properties?.name ||
        f.properties?.nama ||
        f.properties?.NAMA_OBJEK ||
        f.properties?.NAMA_POS ||
        f.properties?.KABUPATEN ||
        '';
      return name.toLowerCase().includes(q);
    });
  }, [drawerLayer, searchFeature]);

  return (
    <section className="flex h-screen w-full overflow-hidden">
      {/* MAP AREA (3 flex) */}
      <div className="relative h-full w-full flex-[3]">
        <MapContainer
          center={[0.5412, 123.0595]}
          zoom={9}
          className="h-screen w-full"
          style={{ height: '100vh', width: '100%' }}
        >
          <MapController onMapReady={setMapInstance} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.values(selectedLayers).map((layer) => (
            <GeoJSON
              key={`layer-${layer.id}`}
              data={layer.data}
              style={getFeatureStyle}
              pointToLayer={(feature, latlng) => {
                const markerName = feature.properties?.marker || feature.properties?.icon || layer.marker;
                const markerColor =
                  feature.properties?.['marker-color'] || feature.properties?.stroke || '#1677ff';
                const markerSize = feature.properties?.['marker-size'] || 26;

                if (markerName) {
                  const icon = getLeafletIcon(markerName, markerColor, markerSize);
                  if (icon) return L.marker(latlng, { icon });
                }

                return L.circleMarker(latlng, {
                  radius: 8,
                  fillColor: feature.properties?.fill || '#3388ff',
                  color: feature.properties?.stroke || '#0033cc',
                  weight: 2,
                  fillOpacity: 0.8
                });
              }}
              onEachFeature={onEachFeature}
            />
          ))}
        </MapContainer>

        {/* FLOATING SUMMARY STATS ON MAP */}
        <div className="absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur border border-gray-100">
          <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
            <CompassOutlined className="text-primary-500 text-lg" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Layer Aktif</div>
              <div className="text-sm font-bold text-gray-800">{totalActiveLayers} Layer</div>
            </div>
          </div>
          <div className="pl-1">
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Total Objek / Titik</div>
            <div className="text-sm font-bold text-blue-600">{totalLoadedFeatures} Objek Spasial</div>
          </div>
        </div>
      </div>

      {/* SIDEBAR PANEL (1 flex) */}
      <div className="flex h-full w-full flex-[1] flex-col gap-y-4 overflow-y-auto bg-white p-6 shadow-xl border-l border-gray-100">
        {/* HEADER */}
        <div className="inline-flex items-center justify-between border-b pb-4">
          <div className="flex flex-col">
            <Typography.Title level={4} style={{ margin: 0 }}>
              Geospasial SIH3
            </Typography.Title>
            <Text type="secondary" className="text-xs">
              Portal Peta & Pemantauan Spasial
            </Text>
          </div>
          <Button variant="solid" color="primary" shape="round" onClick={() => navigate('/')}>
            Ke Beranda
          </Button>
        </div>

        {/* SEARCH INPUT */}
        <div>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Cari nama layer / kategori..."
            size="large"
            value={searchLayer}
            onChange={(e) => setSearchLayer(e.target.value)}
            allowClear
          />
        </div>

        {/* LAYER LIST / ACCORDION */}
        {getAllMaps.isLoading ? (
          <div className="flex flex-col gap-y-4">
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : filteredMaps.length === 0 ? (
          <Empty description="Tidak ada layer peta yang sesuai" className="my-8" />
        ) : (
          <div className="flex flex-col gap-y-4">
            {filteredMaps.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-2 shadow-sm">
                <Collapse ghost defaultActiveKey={item.id ? [String(item.id)] : []}>
                  <Collapse.Panel
                    key={String(item.id)}
                    header={
                      <div className="inline-flex w-full items-center justify-between pr-2">
                        <div className="inline-flex items-center gap-x-2.5">
                          <div className="flex items-center justify-center rounded-lg bg-blue-100 p-2 text-blue-600">
                            <AimOutlined className="text-base" />
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{item.nama_kategori}</span>
                        </div>
                        <Badge
                          count={(item.pemetaan || []).length}
                          style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}
                        />
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-y-2.5 pt-2">
                      {(item.pemetaan || []).map((pemetaan) => {
                        const isChecked = Boolean(selectedLayers[pemetaan.id]);
                        const layerData = selectedLayers[pemetaan.id];
                        const featureCount = layerData?.data?.features?.length;

                        return (
                          <div
                            key={pemetaan.id}
                            className={`flex items-center justify-between rounded-lg border p-2.5 transition-all ${
                              isChecked
                                ? 'border-blue-300 bg-blue-50/70 shadow-xs'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleToggleLayer(pemetaan)}
                              className="flex-1"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-xs text-gray-800">
                                  {pemetaan.nama_pemetaan}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Tag color="blue" className="text-[10px] px-1.5 py-0 leading-tight">
                                    {pemetaan.jenis}
                                  </Tag>
                                  {isChecked && featureCount !== undefined && (
                                    <span className="text-[10px] text-blue-600 font-semibold">
                                      ({featureCount} objek)
                                    </span>
                                  )}
                                  {loadingLayers[pemetaan.id] && (
                                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent inline-block"></span>
                                  )}
                                </div>
                              </div>
                            </Checkbox>

                            {/* ACTION BUTTONS: VIEW FEATURE LIST & INFO */}
                            <Space size={4}>
                              {/* BUTTON TO VIEW FEATURE LIST (Only when active) */}
                              {isChecked && (
                                <Tooltip title="Lihat Daftar Titik / Objek">
                                  <Button
                                    size="small"
                                    type="primary"
                                    shape="circle"
                                    icon={<UnorderedListOutlined />}
                                    onClick={() => {
                                      setDrawerLayer(selectedLayers[pemetaan.id]);
                                      setSearchFeature('');
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {/* INFO BUTTON */}
                              <Tooltip title="Info Layer">
                                <Button
                                  size="small"
                                  type="text"
                                  shape="circle"
                                  icon={<InfoCircleOutlined />}
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
                                          key: 'desc',
                                          label: `Deskripsi`,
                                          children: pemetaan.deskripsi || '-'
                                        },
                                        {
                                          key: 'jenis',
                                          label: `Jenis Geometri`,
                                          children: pemetaan.jenis
                                        }
                                      ]
                                    });
                                  }}
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        );
                      })}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DRAWER: FEATURE LIST EXPLORER WITH FLY-TO ACTION */}
      <Drawer
        title={
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2">
              <EnvironmentOutlined className="text-primary-500" />
              <span>Daftar Objek: <strong>{drawerLayer?.name}</strong></span>
            </div>
            <Tag color="blue">{drawerFeatures.length} Objek</Tag>
          </div>
        }
        placement="right"
        width={380}
        onClose={() => setDrawerLayer(null)}
        open={Boolean(drawerLayer)}
      >
        <div className="flex flex-col gap-3 h-full">
          <div>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Cari titik / objek spasial..."
              value={searchFeature}
              onChange={(e) => setSearchFeature(e.target.value)}
              allowClear
            />
            <Text type="secondary" className="mt-1.5 block text-[11px]">
              💡 Klik salah satu data di bawah ini untuk langsung menuju (zoom) ke titik tersebut pada peta.
            </Text>
          </div>

          <div className="flex-1 overflow-y-auto">
            {drawerFeatures.length === 0 ? (
              <Empty description="Tidak ada objek yang ditemukan" className="my-12" />
            ) : (
              <List
                dataSource={drawerFeatures}
                renderItem={(feat, index) => {
                  const name =
                    feat.properties?.name ||
                    feat.properties?.nama ||
                    feat.properties?.NAMA_OBJEK ||
                    feat.properties?.NAMA_POS ||
                    feat.properties?.KABUPATEN ||
                    `Objek #${index + 1}`;

                  const coords = feat.geometry?.type === 'Point' ? feat.geometry.coordinates : null;

                  return (
                    <List.Item
                      className="cursor-pointer rounded-lg p-2.5 transition-all hover:bg-blue-50 border-b border-gray-100"
                      onClick={() => handleFlyToFeature(feat)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-gray-800">{name}</div>
                            {coords && (
                              <div className="text-[10px] text-gray-400">
                                {coords[1].toFixed(4)}, {coords[0].toFixed(4)}
                              </div>
                            )}
                          </div>
                        </div>

                        <Tooltip title="Tampilkan pada peta">
                          <Button size="small" type="link" icon={<AimOutlined />} />
                        </Tooltip>
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default Map;
