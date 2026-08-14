import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Skeleton, Typography } from 'antd';
import PropTypes from 'prop-types';

const TopArtikelCard = ({ data }) => {
  return (
    <Card size="small" title="Top Artikel">
      {!data || data.length === 0 ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 220
          }}
        />
      ) : (
        <div className="flex flex-col divide-y">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-x-3 py-2">
              <div className="flex min-w-0 items-center gap-x-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">{index + 1}</span>
                <Typography.Text ellipsis className="text-sm">
                  {item.judul}
                </Typography.Text>
              </div>
              <div className="inline-flex shrink-0 items-center gap-x-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-x-1">
                  <EyeOutlined />
                  {item.total_kunjungan}
                </span>
                <span className="inline-flex items-center gap-x-1">
                  <DownloadOutlined />
                  {item.total_unduh}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

TopArtikelCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      judul: PropTypes.string.isRequired,
      total_kunjungan: PropTypes.number,
      total_unduh: PropTypes.number
    })
  )
};

export default TopArtikelCard;
