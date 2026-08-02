import { Typography } from "antd"
import PropTypes from "prop-types";

const HidrologiWsStatisticCard = ({ label, data }) => {
    return (
        <div className="w-72 flex-shrink-0 flex flex-col gap-y-2">
            <img className="w-full h-32 rounded-lg object-cover" src="/image_asset/background/das_limboto_reference.jpg" alt="Description" />
            <Typography.Title level={5} style={{ margin: 0 }}>
                {label}
            </Typography.Title>
            <hr />
            {data.map((item, index) => (
                <div key={index} className="inline-flex items-center justify-between">
                    <p className="text-xs font-semibold">
                        {item.label}
                    </p>
                    <span className="text-xs text-gray-500">
                        {item.value}
                    </span>
                </div>
            ))}
           
        </div>
    )
}

HidrologiWsStatisticCard.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired
};

export default HidrologiWsStatisticCard