import { Column } from '@ant-design/charts';
import { Card, Skeleton } from 'antd';
import PropTypes from 'prop-types';

const AdminStatisticChart = ({ data, loading }) => {
  // const data = [
  //     {
  //         type: "Informasi Teknis",
  //         value: 120,
  //         color: "#059669",
  //     },
  //     {
  //         type: "Berita",
  //         value: 90,
  //         color: "#2563EB",
  //     },
  //     {
  //         type: "Pos Pengamatan",
  //         value: 60,
  //         color: "#D97706",
  //     },
  //     {
  //         type: "Pemetaan GIS",
  //         value: 80,
  //         color: "#7C3AED",
  //     },
  // ];

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    height: 200,

    colorField: 'color',

    scale: {
      color: {
        range: ['#059669', '#2563EB', '#D97706', '#7C3AED']
      }
    },

    legend: false,

    axis: {
      x: {
        label: false,
        tick: false,
        line: false,
        title: false
      },
      y: {
        grid: true,
        line: false
      }
    },

    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
      maxWidth: 32 // lebar maksimal setiap bar
    },

    insetLeft: 2,
    insetRight: 2,

    label: false
  };

  return (
    <Card size="small" title="Statistik Publikasi">
      <div className="mb-5 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
          <span className="text-xs">Informasi Teknis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
          <span className="text-xs">Berita</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="text-xs">Pos Pengamatan</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-violet-500"></span>
          <span className="text-xs">Pemetaan GIS</span>
        </div>
      </div>

      {loading || !data || data.length === 0 ? (
        <Skeleton.Node
          active
          style={{
            width: '100%',
            height: 300
          }}
        />
      ) : (
        <Column {...config} />
      )}
    </Card>
  );
};

AdminStatisticChart.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool
};

export default AdminStatisticChart;
