/* eslint-disable react/prop-types */
import React from 'react';
import {
  Card,
  Button,
  ColorPicker,
  Slider,
  Radio,
  Select,
  Tag,
  Spin,
  Alert,
  Popconfirm,
  Space,
  Typography,
  Divider,
  Breadcrumb,
  Descriptions,
  Collapse,
  Tooltip,
  Segmented
} from 'antd';
import {
  ArrowLeftOutlined,
  BgColorsOutlined,
  ReloadOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EnvironmentFilled,
  FormatPainterOutlined
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MapsService from '@/services/MapsService';
import { useAuth, useNotification } from '@/hooks';
import { getLeafletIcon } from '@/utils/getLeafletIcon';

const { Title, Text } = Typography;

// Curated popular icons for geospatial points
const POPULAR_MAP_ICONS = [
  'EnvironmentFilled',
  'EnvironmentOutlined',
  'PushpinFilled',
  'PushpinOutlined',
  'AimOutlined',
  'CompassFilled',
  'FlagFilled',
  'ThunderboltFilled',
  'CloudFilled',
  'ExperimentFilled',
  'ToolFilled',
  'BuildFilled',
  'FireFilled',
  'HomeFilled',
  'MedicineBoxFilled',
  'AlertFilled',
  'NotificationFilled',
  'EyeFilled',
  'TagFilled',
  'StarFilled',
  'HeartFilled',
  'SafetyCertificateFilled',
  'WarningFilled',
  'InfoCircleFilled'
];

// Helper component to auto-fit map bounds to the loaded GeoJSON
const MapBoundsAdjuster = ({ geojsonData }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) return;

    try {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    } catch (e) {
      console.error('Error fitting bounds:', e);
    }
  }, [geojsonData, map]);

  return null;
};

export default function CustomizeMap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { success, error } = useNotification();

  const [mapDetail, setMapDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [loadError, setLoadError] = React.useState(null);

  // Raw GeoJSON data from server
  const [geojsonData, setGeojsonData] = React.useState(null);
  // Key to force re-render Leaflet GeoJSON layer when data or styles change
  const [renderKey, setRenderKey] = React.useState(0);

  // Customization mode: 'all' or 'single'
  const [customMode, setCustomMode] = React.useState('all');
  const [selectedFeatureIndex, setSelectedFeatureIndex] = React.useState(0);

  // Active Tab for point or polygon styling
  const [styleTab, setStyleTab] = React.useState('marker');

  // Point / Marker States
  const [markerIcon, setMarkerIcon] = React.useState('EnvironmentFilled');
  const [markerColor, setMarkerColor] = React.useState('#1677ff');
  const [markerSize, setMarkerSize] = React.useState(28);

  // Polygon / Polyline Style States
  const [fillColor, setFillColor] = React.useState('#3388ff');
  const [fillOpacity, setFillOpacity] = React.useState(0.4);
  const [strokeColor, setStrokeColor] = React.useState('#0033cc');
  const [strokeWidth, setStrokeWidth] = React.useState(2);
  const [strokeOpacity, setStrokeOpacity] = React.useState(1.0);

  // Generate all available Ant Design icon names
  const allIconNames = React.useMemo(() => {
    return Object.keys(Icons).filter(
      (name) => (name.endsWith('Filled') || name.endsWith('Outlined')) && typeof Icons[name] === 'object'
    );
  }, []);

  // Fetch Map Detail & GeoJSON data
  const fetchData = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      // 1. Load map detail & GeoJSON in parallel
      const [detailRes, rawGeojson] = await Promise.all([
        MapsService.getById(id, token),
        MapsService.getGeoJson(id)
      ]);

      const detail = detailRes?.data || detailRes;
      setMapDetail(detail);

      if (detail?.marker) {
        setMarkerIcon(detail.marker);
      }

      // Normalize GeoJSON
      let geojson = rawGeojson;
      if (!geojson) {
        throw new Error('Data GeoJSON kosong.');
      }

      // If geojson is wrapped or single Feature, normalize to FeatureCollection
      if (geojson.type === 'Feature') {
        geojson = {
          type: 'FeatureCollection',
          features: [geojson]
        };
      } else if (!geojson.type || !Array.isArray(geojson.features)) {
        if (Array.isArray(geojson)) {
          geojson = {
            type: 'FeatureCollection',
            features: geojson
          };
        } else {
          throw new Error('Format GeoJSON tidak valid.');
        }
      }

      setGeojsonData(geojson);

      // Check geometry type to set initial tab
      const isPoint =
        detail?.geometry === 'point' ||
        geojson?.features?.some((f) => f.geometry?.type === 'Point' || f.geometry?.type === 'MultiPoint');
      setStyleTab(isPoint ? 'marker' : 'polygon');

      // Extract style from first feature if available
      const firstFeature = geojson.features?.[0]?.properties;
      if (firstFeature) {
        if (firstFeature.marker || firstFeature.icon) {
          setMarkerIcon(firstFeature.marker || firstFeature.icon);
        } else if (detail?.marker) {
          setMarkerIcon(detail.marker);
        }

        if (firstFeature['marker-color']) {
          setMarkerColor(firstFeature['marker-color']);
        }
        if (firstFeature['marker-size']) {
          setMarkerSize(Number(firstFeature['marker-size']));
        }
        if (firstFeature.fill) setFillColor(firstFeature.fill);
        if (firstFeature['fill-opacity'] !== undefined) setFillOpacity(Number(firstFeature['fill-opacity']));
        if (firstFeature.stroke) setStrokeColor(firstFeature.stroke);
        if (firstFeature['stroke-width'] !== undefined) setStrokeWidth(Number(firstFeature['stroke-width']));
        if (firstFeature['stroke-opacity'] !== undefined) setStrokeOpacity(Number(firstFeature['stroke-opacity']));
      }

      setRenderKey((k) => k + 1);
    } catch (err) {
      // Ignore AbortError caused by React double-mounting in dev mode
      if (err?.name === 'AbortError' || err?.message?.toLowerCase().includes('abort')) {
        return;
      }
      console.error('Error fetching map customization data:', err);
      setLoadError(err.message || 'Gagal memuat data pemetaan.');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply style to all features in GeoJSON
  const applyStyleToAll = (styles) => {
    if (!geojsonData?.features) return;

    const newFeatures = geojsonData.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        ...(styles.marker !== undefined ? { marker: styles.marker } : {}),
        ...(styles.markerColor !== undefined ? { 'marker-color': styles.markerColor } : {}),
        ...(styles.markerSize !== undefined ? { 'marker-size': styles.markerSize } : {}),
        ...(styles.fillColor !== undefined ? { fill: styles.fillColor } : {}),
        ...(styles.fillOpacity !== undefined ? { 'fill-opacity': styles.fillOpacity } : {}),
        ...(styles.strokeColor !== undefined ? { stroke: styles.strokeColor } : {}),
        ...(styles.strokeWidth !== undefined ? { 'stroke-width': styles.strokeWidth } : {}),
        ...(styles.strokeOpacity !== undefined ? { 'stroke-opacity': styles.strokeOpacity } : {})
      }
    }));

    setGeojsonData({
      ...geojsonData,
      features: newFeatures
    });
    setRenderKey((k) => k + 1);
  };

  // Apply style to a single feature in GeoJSON
  const applyStyleToSingle = (index, styles) => {
    if (!geojsonData?.features || !geojsonData.features[index]) return;

    const newFeatures = [...geojsonData.features];
    const targetFeature = newFeatures[index];
    newFeatures[index] = {
      ...targetFeature,
      properties: {
        ...targetFeature.properties,
        ...(styles.marker !== undefined ? { marker: styles.marker } : {}),
        ...(styles.markerColor !== undefined ? { 'marker-color': styles.markerColor } : {}),
        ...(styles.markerSize !== undefined ? { 'marker-size': styles.markerSize } : {}),
        ...(styles.fillColor !== undefined ? { fill: styles.fillColor } : {}),
        ...(styles.fillOpacity !== undefined ? { 'fill-opacity': styles.fillOpacity } : {}),
        ...(styles.strokeColor !== undefined ? { stroke: styles.strokeColor } : {}),
        ...(styles.strokeWidth !== undefined ? { 'stroke-width': styles.strokeWidth } : {}),
        ...(styles.strokeOpacity !== undefined ? { 'stroke-opacity': styles.strokeOpacity } : {})
      }
    };

    setGeojsonData({
      ...geojsonData,
      features: newFeatures
    });
    setRenderKey((k) => k + 1);
  };

  // Handlers for Marker Icon Changes
  const handleMarkerIconChange = (iconName) => {
    setMarkerIcon(iconName);
    if (customMode === 'all') {
      applyStyleToAll({ marker: iconName });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { marker: iconName });
    }
  };

  const handleMarkerColorChange = (colorValue) => {
    const hex = typeof colorValue === 'string' ? colorValue : colorValue.toHexString();
    setMarkerColor(hex);
    if (customMode === 'all') {
      applyStyleToAll({ markerColor: hex });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { markerColor: hex });
    }
  };

  const handleMarkerSizeChange = (val) => {
    setMarkerSize(val);
    if (customMode === 'all') {
      applyStyleToAll({ markerSize: val });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { markerSize: val });
    }
  };

  // Handlers for Polygon/Polyline Style Changes
  const handleFillColorChange = (colorValue) => {
    const hex = typeof colorValue === 'string' ? colorValue : colorValue.toHexString();
    setFillColor(hex);
    if (customMode === 'all') {
      applyStyleToAll({ fillColor: hex });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { fillColor: hex });
    }
  };

  const handleFillOpacityChange = (val) => {
    setFillOpacity(val);
    if (customMode === 'all') {
      applyStyleToAll({ fillOpacity: val });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { fillOpacity: val });
    }
  };

  const handleStrokeColorChange = (colorValue) => {
    const hex = typeof colorValue === 'string' ? colorValue : colorValue.toHexString();
    setStrokeColor(hex);
    if (customMode === 'all') {
      applyStyleToAll({ strokeColor: hex });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { strokeColor: hex });
    }
  };

  const handleStrokeWidthChange = (val) => {
    setStrokeWidth(val);
    if (customMode === 'all') {
      applyStyleToAll({ strokeWidth: val });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { strokeWidth: val });
    }
  };

  const handleStrokeOpacityChange = (val) => {
    setStrokeOpacity(val);
    if (customMode === 'all') {
      applyStyleToAll({ strokeOpacity: val });
    } else {
      applyStyleToSingle(selectedFeatureIndex, { strokeOpacity: val });
    }
  };

  // Sync selected feature style when selecting a feature in 'single' mode
  const handleSelectFeature = (index) => {
    setSelectedFeatureIndex(index);
    const featureProps = geojsonData?.features?.[index]?.properties;
    if (featureProps) {
      if (featureProps.marker || featureProps.icon) {
        setMarkerIcon(featureProps.marker || featureProps.icon);
      }
      if (featureProps['marker-color']) {
        setMarkerColor(featureProps['marker-color']);
      }
      if (featureProps['marker-size']) {
        setMarkerSize(Number(featureProps['marker-size']));
      }
      if (featureProps.fill) setFillColor(featureProps.fill);
      if (featureProps['fill-opacity'] !== undefined) setFillOpacity(Number(featureProps['fill-opacity']));
      if (featureProps.stroke) setStrokeColor(featureProps.stroke);
      if (featureProps['stroke-width'] !== undefined) setStrokeWidth(Number(featureProps['stroke-width']));
      if (featureProps['stroke-opacity'] !== undefined) setStrokeOpacity(Number(featureProps['stroke-opacity']));
    }
  };

  // Save customization to backend
  const handleSave = async () => {
    if (!geojsonData) return;
    setSaving(true);
    try {
      const response = await MapsService.customize(id, geojsonData, token);
      if (response?.status || response?.code === 200) {
        success('Berhasil', response.message || 'Kustomisasi warna & ikon peta berhasil disimpan');
        // Refresh details
        const detailRes = await MapsService.getById(id, token);
        setMapDetail(detailRes?.data || detailRes);
      } else {
        error('Gagal', response?.message || 'Gagal menyimpan kustomisasi peta');
      }
    } catch (err) {
      console.error('Error saving customization:', err);
      error('Gagal', err.message || 'Terjadi kesalahan saat menyimpan kustomisasi');
    } finally {
      setSaving(false);
    }
  };

  // Reset to initial GeoJSON
  const handleReset = async () => {
    if (!id) return;
    setResetting(true);
    try {
      const response = await MapsService.reset(id, token);
      if (response?.status || response?.code === 200) {
        success('Berhasil', response.message || 'Data peta berhasil dikembalikan ke kondisi awal');
        await fetchData();
      } else {
        error('Gagal', response?.message || 'Gagal mereset peta ke data awal');
      }
    } catch (err) {
      console.error('Error resetting GeoJSON:', err);
      error('Gagal', err.message || 'Terjadi kesalahan saat mereset peta');
    } finally {
      setResetting(false);
    }
  };

  // Leaflet feature styling logic
  const getFeatureStyle = (feature) => {
    const props = feature.properties || {};
    return {
      color: props.stroke || strokeColor || '#0033cc',
      weight: props['stroke-width'] !== undefined ? Number(props['stroke-width']) : strokeWidth,
      opacity: props['stroke-opacity'] !== undefined ? Number(props['stroke-opacity']) : strokeOpacity,
      fillColor: props.fill || fillColor || '#3388ff',
      fillOpacity: props['fill-opacity'] !== undefined ? Number(props['fill-opacity']) : fillOpacity
    };
  };

  const onEachFeature = (feature, layer) => {
    const featureName =
      feature.properties?.name ||
      feature.properties?.nama ||
      feature.properties?.NAMA_OBJEK ||
      feature.properties?.KABUPATEN ||
      `Fitur #${layer._leaflet_id || ''}`;
    layer.bindTooltip(featureName, { sticky: true });

    layer.on('click', () => {
      if (geojsonData?.features) {
        const idx = geojsonData.features.indexOf(feature);
        if (idx !== -1) {
          setCustomMode('single');
          handleSelectFeature(idx);
        }
      }
    });
  };

  // Preset colors for AntD ColorPicker
  const presets = [
    {
      label: 'Tema SIH3',
      colors: [
        '#1677ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d',
        '#722ed1', '#eb2f96', '#2f54eb', '#fa8c16', '#a0d911'
      ]
    },
    {
      label: 'Nuansa Alam & Air',
      colors: [
        '#003eb3', '#096dd9', '#1890ff', '#40a9ff', '#69c0ff',
        '#006d75', '#08979c', '#13c2c2', '#36cfc9', '#5cdbd3',
        '#237804', '#389e0d', '#52c41a', '#73d13d', '#95de64'
      ]
    },
    {
      label: 'Peringatan & Zonasi',
      colors: [
        '#cf1322', '#f5222d', '#ff4d4f', '#ff7875',
        '#d46b08', '#fa8c16', '#ffa940', '#ffd666',
        '#389e0d', '#52c41a', '#73d13d', '#b7eb8f'
      ]
    }
  ];

  const totalFeatures = geojsonData?.features?.length || 0;
  const currentSelectedProps = geojsonData?.features?.[selectedFeatureIndex]?.properties || {};
  const isPointGeometry =
    mapDetail?.geometry === 'point' ||
    geojsonData?.features?.some((f) => f.geometry?.type === 'Point' || f.geometry?.type === 'MultiPoint');

  const CurrentMarkerIconComp = Icons[markerIcon] || EnvironmentFilled;

  return (
    <div className="space-y-4 p-2">
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb
            items={[
              { title: <Link to="/dashboard">Dashboard</Link> },
              { title: <Link to="/dashboard/maps">Pemetaan</Link> },
              { title: 'Kustomisasi Tampilan' }
            ]}
          />
          <div className="mt-1 flex items-center gap-3">
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard/maps')}
            />
            <div>
              <Title level={4} className="!mb-0">
                Kustomisasi Peta: {mapDetail?.map_name || 'Memuat...'}
              </Title>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {mapDetail?.geometry && (
                  <Tag color="blue" className="capitalize">
                    {mapDetail.geometry}
                  </Tag>
                )}
                {mapDetail?.category_id?.category_name && (
                  <Tag color="cyan">{mapDetail.category_id.category_name}</Tag>
                )}
                {mapDetail?.is_customized ? (
                  <Tag color="purple" icon={<CheckCircleOutlined />}>
                    Telah Dikustomisasi
                  </Tag>
                ) : (
                  <Tag color="default">Data Asli</Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS TOP BAR */}
        <Space>
          <Popconfirm
            title="Reset ke Data Awal"
            description="Apakah Anda yakin ingin mengembalikan peta ke file asli sebelum kustomisasi?"
            onConfirm={handleReset}
            okText="Ya, Reset"
            cancelText="Batal"
            okButtonProps={{ danger: true, loading: resetting }}
            disabled={!mapDetail?.is_customized && !mapDetail?.file_original}
          >
            <Button
              danger
              icon={<ReloadOutlined />}
              loading={resetting}
              disabled={!mapDetail?.is_customized && !mapDetail?.file_original}
            >
              Reset ke Data Awal
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            disabled={loading || !geojsonData}
            size="middle"
          >
            Simpan Kustomisasi
          </Button>
        </Space>
      </div>

      {loading ? (
        <Card className="flex h-[680px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spin size="large" />
            <Text type="secondary">Memuat data peta dan file spasial GeoJSON...</Text>
          </div>
        </Card>
      ) : loadError ? (
        <Card>
          <Alert
            type="error"
            showIcon
            message="Gagal Memuat Data Peta"
            description={loadError}
            action={
              <Button size="small" type="primary" onClick={fetchData}>
                Coba Lagi
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* MAP CANVAS (8 COLS) */}
          <Card
            className="overflow-hidden shadow-sm lg:col-span-8"
            bodyStyle={{ padding: 0, position: 'relative', height: '680px' }}
          >
            <MapContainer
              center={[0.5412, 123.0595]}
              zoom={9}
              className="h-full w-full"
              style={{ height: '680px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {geojsonData && (
                <>
                  <GeoJSON
                    key={`geojson-page-${renderKey}`}
                    data={geojsonData}
                    style={getFeatureStyle}
                    pointToLayer={(feature, latlng) => {
                      const iconName =
                        feature.properties?.marker ||
                        feature.properties?.icon ||
                        markerIcon ||
                        mapDetail?.marker ||
                        'EnvironmentFilled';
                      const iconColor =
                        feature.properties?.['marker-color'] ||
                        feature.properties?.stroke ||
                        markerColor ||
                        '#1677ff';
                      const iconSize = feature.properties?.['marker-size'] || markerSize || 28;

                      const icon = getLeafletIcon(iconName, iconColor, iconSize);
                      if (icon) return L.marker(latlng, { icon });

                      return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: feature.properties?.fill || fillColor,
                        color: feature.properties?.stroke || strokeColor,
                        weight: feature.properties?.['stroke-width'] || strokeWidth,
                        opacity: feature.properties?.['stroke-opacity'] || strokeOpacity,
                        fillOpacity: feature.properties?.['fill-opacity'] || fillOpacity
                      });
                    }}
                    onEachFeature={onEachFeature}
                  />
                  <MapBoundsAdjuster geojsonData={geojsonData} />
                </>
              )}
            </MapContainer>

            {/* FLOATING MAP STATUS BADGE */}
            <div className="pointer-events-none absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur">
              <span className="font-semibold text-gray-800">Total Fitur Spasial:</span>
              <Tag color="blue">{totalFeatures} objek</Tag>
              <span className="text-gray-400">| Klik titik/poligon pada peta untuk memilih</span>
            </div>
          </Card>

          {/* CONTROLS SIDEBAR (4 COLS) */}
          <div className="space-y-4 lg:col-span-4">
            <Card
              title={
                <span className="flex items-center gap-2">
                  <BgColorsOutlined className="text-primary-500" />
                  Pengaturan Kustomisasi
                </span>
              }
              className="shadow-sm"
            >
              <div className="space-y-4">
                {/* MODE SELECTION */}
                <div>
                  <Text className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Cakupan Kustomisasi:
                  </Text>
                  <Radio.Group
                    value={customMode}
                    onChange={(e) => {
                      const newMode = e.target.value;
                      setCustomMode(newMode);
                      if (newMode === 'all') {
                        applyStyleToAll({
                          marker: markerIcon,
                          markerColor: markerColor,
                          markerSize: markerSize,
                          fillColor: fillColor,
                          fillOpacity: fillOpacity,
                          strokeColor: strokeColor,
                          strokeWidth: strokeWidth,
                          strokeOpacity: strokeOpacity
                        });
                      }
                    }}
                    buttonStyle="solid"
                    className="w-full"
                  >
                    <Radio.Button value="all" className="w-1/2 text-center">
                      Semua Fitur ({totalFeatures})
                    </Radio.Button>
                    <Radio.Button
                      value="single"
                      className="w-1/2 text-center"
                      disabled={totalFeatures <= 1}
                    >
                      Per Fitur
                    </Radio.Button>
                  </Radio.Group>
                </div>

                {customMode === 'single' && (
                  <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3">
                    <Text className="mb-1.5 block text-xs font-semibold text-blue-800">
                      Pilih Fitur yang Diedit:
                    </Text>
                    <Select
                      value={selectedFeatureIndex}
                      onChange={handleSelectFeature}
                      className="w-full"
                      options={geojsonData?.features?.map((f, idx) => {
                        const name =
                          f.properties?.name ||
                          f.properties?.nama ||
                          f.properties?.NAMA_OBJEK ||
                          f.properties?.KABUPATEN ||
                          `Fitur #${idx + 1} (${f.geometry?.type || 'Objek'})`;
                        return {
                          value: idx,
                          label: `${idx + 1}. ${name}`
                        };
                      })}
                    />
                    <Text type="secondary" className="mt-1.5 block text-[11px]">
                      💡 Klik langsung objek titik/poligon pada peta untuk memilihnya secara cepat.
                    </Text>
                  </div>
                )}

                {/* TAB SWITCHER IF MIXED OR POINT */}
                <Segmented
                  block
                  value={styleTab}
                  onChange={setStyleTab}
                  options={[
                    {
                      label: (
                        <div className="flex items-center justify-center gap-1.5 py-0.5">
                          <EnvironmentFilled />
                          <span>Ikon Titik (Marker)</span>
                        </div>
                      ),
                      value: 'marker'
                    },
                    {
                      label: (
                        <div className="flex items-center justify-center gap-1.5 py-0.5">
                          <FormatPainterOutlined />
                          <span>Warna Area / Garis</span>
                        </div>
                      ),
                      value: 'polygon'
                    }
                  ]}
                />

                <Divider className="!my-1" />

                {/* 1. MARKER ICON STYLING */}
                {styleTab === 'marker' && (
                  <div className="space-y-4">
                    {/* CURRENT ICON PREVIEW & COLOR */}
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <Text strong className="text-xs">
                            Warna Ikon (Marker Color)
                          </Text>
                          <div className="text-[11px] text-gray-400">
                            Warna ikon titik pada peta
                          </div>
                        </div>
                        <ColorPicker
                          value={markerColor}
                          onChange={handleMarkerColorChange}
                          presets={presets}
                          showText
                          format="hex"
                        />
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Ukuran Ikon:</span>
                          <span className="font-semibold">{markerSize} px</span>
                        </div>
                        <Slider
                          min={16}
                          max={56}
                          step={2}
                          value={markerSize}
                          onChange={handleMarkerSizeChange}
                          className="!my-1"
                        />
                      </div>
                    </div>

                    {/* POPULAR ICONS QUICK GRID */}
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                      <Text strong className="mb-2 block text-xs">
                        Pilih Ikon Cepat:
                      </Text>
                      <div className="grid grid-cols-6 gap-2">
                        {POPULAR_MAP_ICONS.map((name) => {
                          const IconComponent = Icons[name];
                          if (!IconComponent) return null;
                          const isSelected = markerIcon === name;
                          return (
                            <Tooltip key={name} title={name}>
                              <button
                                type="button"
                                onClick={() => handleMarkerIconChange(name)}
                                className={`flex aspect-square items-center justify-center rounded-lg border text-xl transition-all ${
                                  isSelected
                                    ? 'border-primary-500 bg-blue-50 text-primary-500 shadow-sm ring-2 ring-blue-300'
                                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-white'
                                }`}
                              >
                                <IconComponent style={{ color: isSelected ? markerColor : undefined }} />
                              </button>
                            </Tooltip>
                          );
                        })}
                      </div>

                      {/* SEARCHABLE FULL ICON SELECTOR */}
                      <div className="mt-3">
                        <Text className="mb-1 block text-[11px] text-gray-500">
                          Atau cari semua ikon Ant Design:
                        </Text>
                        <Select
                          showSearch
                          value={markerIcon}
                          onChange={handleMarkerIconChange}
                          className="w-full"
                          placeholder="Cari nama ikon..."
                          optionLabelProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={allIconNames.map((name) => {
                            const Comp = Icons[name];
                            return {
                              value: name,
                              label: name,
                              children: (
                                <div className="flex items-center gap-2">
                                  {Comp && <Comp style={{ color: markerColor }} />}
                                  <span>{name}</span>
                                </div>
                              )
                            };
                          })}
                          optionRender={(option) => option.data.children}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. POLYGON / POLYLINE STYLING */}
                {styleTab === 'polygon' && (
                  <div className="space-y-4">
                    {/* FILL COLOR */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <Text strong className="text-xs">
                            Warna Isian (Fill Color)
                          </Text>
                          <div className="text-[11px] text-gray-400">
                            Warna area dalam poligon / titik
                          </div>
                        </div>
                        <ColorPicker
                          value={fillColor}
                          onChange={handleFillColorChange}
                          presets={presets}
                          showText
                          format="hex"
                        />
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Transparansi Isian:</span>
                          <span className="font-semibold">{Math.round(fillOpacity * 100)}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={1}
                          step={0.05}
                          value={fillOpacity}
                          onChange={handleFillOpacityChange}
                          className="!my-1"
                        />
                      </div>
                    </div>

                    {/* STROKE COLOR */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <Text strong className="text-xs">
                            Warna Garis / Batas (Stroke)
                          </Text>
                          <div className="text-[11px] text-gray-400">
                            Warna garis tepi atau polyline
                          </div>
                        </div>
                        <ColorPicker
                          value={strokeColor}
                          onChange={handleStrokeColorChange}
                          presets={presets}
                          showText
                          format="hex"
                        />
                      </div>

                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Ketebalan Garis:</span>
                            <span className="font-semibold">{strokeWidth} px</span>
                          </div>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={strokeWidth}
                            onChange={handleStrokeWidthChange}
                            className="!my-1"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Transparansi Garis:</span>
                            <span className="font-semibold">{Math.round(strokeOpacity * 100)}%</span>
                          </div>
                          <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={strokeOpacity}
                            onChange={handleStrokeOpacityChange}
                            className="!my-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200">
                  <InfoCircleOutlined className="mr-1.5" />
                  Perubahan ikon & warna langsung terlihat secara live pada peta di sebelah kiri sebelum Anda menekan tombol Simpan.
                </div>
              </div>
            </Card>

            {/* ATTRIBUTE INSPECTOR */}
            {customMode === 'single' && Object.keys(currentSelectedProps).length > 0 && (
              <Collapse
                size="small"
                items={[
                  {
                    key: 'attributes',
                    label: (
                      <span className="text-xs font-semibold text-gray-700">
                        <EyeOutlined className="mr-1" /> Atribut Fitur #{selectedFeatureIndex + 1}
                      </span>
                    ),
                    children: (
                      <div className="max-h-48 overflow-y-auto">
                        <Descriptions size="small" column={1} bordered>
                          {Object.entries(currentSelectedProps)
                            .filter(
                              ([k]) =>
                                ![
                                  'fill',
                                  'fill-opacity',
                                  'stroke',
                                  'stroke-width',
                                  'stroke-opacity',
                                  'marker',
                                  'icon',
                                  'marker-color',
                                  'marker-size'
                                ].includes(k)
                            )
                            .map(([k, v]) => (
                              <Descriptions.Item
                                key={k}
                                label={<span className="text-[11px] font-medium">{k}</span>}
                              >
                                <span className="text-[11px]">{String(v)}</span>
                              </Descriptions.Item>
                            ))}
                        </Descriptions>
                      </div>
                    )
                  }
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
