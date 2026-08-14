import { Pie } from '@ant-design/charts';
import { Card, Skeleton } from 'antd';
import PropTypes from 'prop-types';

const PosPerJenisCard = ({ data }) => {
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
      {!data || data.length === 0 ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 220
          }}
        />
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
  )
};

export default PosPerJenisCard;
