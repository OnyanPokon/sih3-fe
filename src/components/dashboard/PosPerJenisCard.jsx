import { Pie } from '@ant-design/charts';
import { Card, Empty, Skeleton } from 'antd';
import PropTypes from 'prop-types';

const PosPerJenisCard = ({ data, loading }) => {
  const config = {
    data: data ?? [],
    angleField: 'total',
    colorField: 'nama',
    height: 220,
    legend: {
      color: {
        position: 'right'
      }
    },
    label: false
  };

  return (
    <Card size="small" title="Pos Pengamatan per Jenis">
      {loading ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 220
          }}
        />
      ) : !data || data.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada jenis pos" />
        </div>
      ) : (
        <Pie {...config} />
      )}
    </Card>
  );
};

PosPerJenisCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nama: PropTypes.string.isRequired,
      total: PropTypes.number
    })
  ),
  loading: PropTypes.bool
};

export default PosPerJenisCard;
