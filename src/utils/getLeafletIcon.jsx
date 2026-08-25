import ReactDOMServer from 'react-dom/server';
import * as Icons from '@ant-design/icons';
import L from 'leaflet';

export const getLeafletIcon = (iconName, color = '#1677ff', size = 24) => {
  if (!iconName) return null;
  const IconComp = Icons[iconName];
  if (!IconComp) return null;

  const svgString = ReactDOMServer.renderToString(
    <div style={{ display: 'inline-flex', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
      <IconComp style={{ fontSize: `${size}px`, color }} />
    </div>
  );

  return L.divIcon({
    html: svgString,
    className: 'antd-leaflet-icon',
    iconSize: [size + 8, size + 8],
    iconAnchor: [Math.round((size + 8) / 2), size + 4]
  });
};
