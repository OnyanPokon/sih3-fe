import { Card, Skeleton, Statistic } from 'antd';
import PropTypes from 'prop-types';

const KuesionerRingkasanCard = ({ data }) => {
  return (
    <Card size="small" title="Ringkasan Kuesioner">
      {!data ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 220
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Statistic title="Rata-rata Nilai" value={data.rata_rata_nilai ?? 0} precision={2} />
          <Statistic title="Jumlah Responden" value={data.jumlah_responden ?? 0} />
        </div>
      )}
    </Card>
  );
};

KuesionerRingkasanCard.propTypes = {
  data: PropTypes.shape({
    rata_rata_nilai: PropTypes.number,
    jumlah_responden: PropTypes.number
  })
};

export default KuesionerRingkasanCard;
