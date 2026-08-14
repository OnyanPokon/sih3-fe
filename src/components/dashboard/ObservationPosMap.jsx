import { useAuth } from '@/hooks';
import useAbortableService from '@/hooks/useAbortableService';
import { ObservationPosService } from '@/services';
import { Card, Skeleton, Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const DEFAULT_CENTER = [0.5435, 123.056];

const ObservationPosMap = ({ extra }) => {
  const { token, onUnauthorized } = useAuth();
  const { execute: fetchObservationPos, ...getAllObservationPos } = useAbortableService(ObservationPosService.getAll, { onUnauthorized });

  React.useEffect(() => {
    fetchObservationPos({ token, per_page: 9999 });
  }, [fetchObservationPos, token]);

  const observationPos = getAllObservationPos.data ?? [];

  const markers = observationPos
    .map((item) => {
      if (!item.coordinate) return null;

      const [lat, lng] = item.coordinate.split(',').map((v) => Number(v.trim()));

      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

      return {
        ...item,
        lat,
        lng
      };
    })
    .filter(Boolean);

  const center = markers.length > 0 ? [markers[0].lat, markers[0].lng] : DEFAULT_CENTER;

  return (
    <Card className="w-full" title="Peta Sebaran Pos Pengamatan" extra={extra}>
      {getAllObservationPos.isLoading ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 480
          }}
        />
      ) : (
        <MapContainer center={center} zoom={9} scrollWheelZoom className="h-[480px] rounded-xl">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((item) => (
            <Marker key={item.id} position={[item.lat, item.lng]}>
              <Popup>
                <div className="space-y-1">
                  <Typography.Text strong>{item.name}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">{item.address || item.coordinate}</Typography.Text>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </Card>
  );
};

ObservationPosMap.propTypes = {
  extra: PropTypes.node
};

export default ObservationPosMap;
