/* eslint-disable react/prop-types */
import React from 'react';
import {
  Modal,
  Button,
  ColorPicker,
  Slider,
  Radio,
  Select,
  Tag,
  Spin,
  Alert,
  Popconfirm,
  Tabs,
  Space,
  Typography,
  Divider,
  Card
} from 'antd';
import {
  BgColorsOutlined,
  ReloadOutlined,
  SaveOutlined,
  AimOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import MapsService from '@/services/MapsService';
import { useAuth, useNotification } from '@/hooks';
import { getLeafletIcon } from '@/utils/getLeafletIcon';

const { Text, Title } = Typography;

// Helper component to auto-fit map bounds to the loaded GeoJSON
const MapBoundsAdjuster = ({ geojsonData }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) return;

    try {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
      }
    } catch (e) {
      console.error('Error fitting bounds:', e);
    }
  }, [geojsonData, map]);

  return null;
};

export default function MapCustomizationModal({ visible, record, onClose, onSuccess }) {
  const { token } = useAuth();
  const { success, error } = useNotification();

  const [loading, setLoading] = React.useState(false);
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

  // Global Style States
  const [fillColor, setFillColor] = React.useState('#3388ff');
  const [fillOpacity, setFillOpacity] = React.useState(0.4);
  const [strokeColor, setStrokeColor] = React.useState('#0033cc');
  const [strokeWidth, setStrokeWidth] = React.useState(2);
  const [strokeOpacity, setStrokeOpacity] = React.useState(1.0);

  // Fetch GeoJSON when modal opens
  const fetchGeoJson = React.useCallback(async () => {
    if (!record?.id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MapsService.getGeoJson(record.id);
      if (!data || !data.type) {
        throw new Error('Data GeoJSON tidak valid');
      }

      setGeojsonData(data);

      // Extract style from first feature if available
      const firstFeature = data.features?.[0]?.properties;
      if (firstFeature) {
        if (firstFeature.fill) setFillColor(firstFeature.fill);
        if (firstFeature['fill-opacity'] !== undefined) setFillOpacity(Number(firstFeature['fill-opacity']));
        if (firstFeature.stroke) setStrokeColor(firstFeature.stroke);
        if (firstFeature['stroke-width'] !== undefined) setStrokeWidth(Number(firstFeature['stroke-width']));
        if (firstFeature['stroke-opacity'] !== undefined) setStrokeOpacity(Number(firstFeature['stroke-opacity']));
      }

      setRenderKey((k) => k + 1);
    } catch (err) {
      console.error('Error fetching GeoJSON:', err);
      setLoadError(err.message || 'Gagal memuat file GeoJSON pemetaan.');
    } finally {
      setLoading(false);
    }
  }, [record?.id]);

  React.useEffect(() => {
    if (visible && record?.id) {
      fetchGeoJson();
    } else {
      setGeojsonData(null);
      setLoadError(null);
    }
  }, [visible, record?.id, fetchGeoJson]);

  // Apply style to all features in GeoJSON
  const applyStyleToAll = (styles) => {
    if (!geojsonData?.features) return;

    const newFeatures = geojsonData.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        fill: styles.fillColor ?? fillColor,
        'fill-opacity': styles.fillOpacity ?? fillOpacity,
        stroke: styles.strokeColor ?? strokeColor,
        'stroke-width': styles.strokeWidth ?? strokeWidth,
        'stroke-opacity': styles.strokeOpacity ?? strokeOpacity
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

  // Handlers for Color / Style Changes
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
      const response = await MapsService.customize(record.id, geojsonData, token);
      if (response?.status || response?.code === 200) {
        success('Berhasil', response.message || 'Kustomisasi warna peta berhasil disimpan');
        if (onSuccess) onSuccess();
        onClose();
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
    if (!record?.id) return;
    setResetting(true);
    try {
      const response = await MapsService.reset(record.id, token);
      if (response?.status || response?.code === 200) {
        success('Berhasil', response.message || 'Data peta berhasil dikembalikan ke kondisi awal');
        await fetchGeoJson();
        if (onSuccess) onSuccess();
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
    const featureName = feature.properties?.name || feature.properties?.nama || feature.properties?.NAMA_OBJEK || `Fitur #${layer._leaflet_id || ''}`;
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
    }
  ];

  const totalFeatures = geojsonData?.features?.length || 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <BgColorsOutlined className="text-primary-500 text-lg" />
          <span>Preview & Kustomisasi Peta: <strong>{record?.map_name}</strong></span>
          {record?.geometry && (
            <Tag color="blue" className="ml-2 capitalize">
              {record.geometry}
            </Tag>
          )}
          {record?.is_customized && (
            <Tag color="purple" icon={<CheckCircleOutlined />}>
              Telah Dikustomisasi
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1100}
      style={{ top: 20 }}
      styles={{ body: { padding: '16px 24px' } }}
      footer={
        <div className="flex items-center justify-between">
          <Popconfirm
            title="Reset ke Data Awal"
            description="Apakah Anda yakin ingin mengembalikan peta ke file asli sebelum kustomisasi?"
            onConfirm={handleReset}
            okText="Ya, Reset"
            cancelText="Batal"
            okButtonProps={{ danger: true, loading: resetting }}
            disabled={!record?.is_customized && !record?.file_original}
          >
            <Button
              danger
              icon={<ReloadOutlined />}
              loading={resetting}
              disabled={!record?.is_customized && !record?.file_original}
            >
              Reset ke Data Awal
            </Button>
          </Popconfirm>

          <Space>
            <Button onClick={onClose} disabled={saving}>
              Batal
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              disabled={loading || !geojsonData}
            >
              Simpan Kustomisasi
            </Button>
          </Space>
        </div>
      }
    >
      {loading ? (
        <div className="flex h-[550px] flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <Text type="secondary">Memuat data spasial GeoJSON...</Text>
        </div>
      ) : loadError ? (
        <div className="py-12">
          <Alert
            type="error"
            showIcon
            message="Gagal Memuat Peta"
            description={loadError}
            action={
              <Button size="small" type="primary" onClick={fetchGeoJson}>
                Coba Lagi
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* MAP PREVIEW AREA (7 cols) */}
          <div className="relative h-[550px] overflow-hidden rounded-lg border border-gray-200 lg:col-span-7">
            <MapContainer
              center={[0.5412, 123.0595]}
              zoom={9}
              className="h-full w-full"
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {geojsonData && (
                <>
                  <GeoJSON
                    key={`geojson-layer-${renderKey}`}
                    data={geojsonData}
                    style={getFeatureStyle}
                    pointToLayer={(feature, latlng) => {
                      if (record?.marker) {
                        const icon = getLeafletIcon(record.marker, strokeColor);
                        if (icon) return L.marker(latlng, { icon });
                      }
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

            {/* Floating Info Badge on Map */}
            <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded bg-white/90 px-3 py-1.5 text-xs shadow-md backdrop-blur">
              <span className="font-semibold text-gray-700">Total Fitur:</span> {totalFeatures} objek
              <span className="ml-2 text-gray-400">| Klik objek untuk kustomisasi khusus</span>
            </div>
          </div>

          {/* COLOR CONTROLS PANEL (5 cols) */}
          <div className="flex h-[550px] flex-col overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 lg:col-span-5">
            <Title level={5} className="!mb-3 flex items-center gap-1.5 text-gray-800">
              <BgColorsOutlined /> Pengaturan Warna & Tampilan
            </Title>

            <div className="mb-4">
              <Text className="mb-1.5 block text-xs font-semibold text-gray-600">Cakupan Kustomisasi:</Text>
              <Radio.Group
                value={customMode}
                onChange={(e) => {
                  setCustomMode(e.target.value);
                  if (e.target.value === 'all') {
                    applyStyleToAll({
                      fillColor,
                      fillOpacity,
                      strokeColor,
                      strokeWidth,
                      strokeOpacity
                    });
                  }
                }}
                buttonStyle="solid"
                className="w-full"
              >
                <Radio.Button value="all" className="w-1/2 text-center">
                  Semua Fitur ({totalFeatures})
                </Radio.Button>
                <Radio.Button value="single" className="w-1/2 text-center" disabled={totalFeatures <= 1}>
                  Per Fitur
                </Radio.Button>
              </Radio.Group>
            </div>

            {customMode === 'single' && (
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50/50 p-3">
                <Text className="mb-1.5 block text-xs font-semibold text-blue-800">Pilih Fitur yang Diedit:</Text>
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
                  💡 Anda juga dapat mengklik langsung objek pada peta untuk memilihnya.
                </Text>
              </div>
            )}

            <Divider className="!my-2" />

            {/* COLOR PICKERS */}
            <div className="flex-1 space-y-4 pr-1">
              {/* 1. FILL COLOR */}
              <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <Text strong className="text-xs">Warna Isian (Fill Color)</Text>
                    <div className="text-[11px] text-gray-400">Warna area dalam poligon / titik</div>
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

              {/* 2. STROKE COLOR */}
              <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <Text strong className="text-xs">Warna Garis / Batas (Stroke)</Text>
                    <div className="text-[11px] text-gray-400">Warna garis tepi atau polyline</div>
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

            <div className="mt-3 rounded bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200">
              <InfoCircleOutlined className="mr-1.5" />
              Perubahan warna langsung terlihat pada preview peta di sebelah kiri sebelum disimpan.
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
