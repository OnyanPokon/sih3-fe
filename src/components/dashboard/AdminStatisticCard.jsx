import { FolderFilled } from '@ant-design/icons';
import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AdminStatisticCard = ({ navigationPath, label, value }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(navigationPath)} className="group col-span-3 flex cursor-pointer flex-col rounded-lg border border-gray-200 p-4 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <FolderFilled className="mb-2 text-3xl text-blue-700" />
      <p className="group-hover: font-semibold">{label}</p>
      <span className="text-xs font-semibold text-gray-500">{value} Item</span>
      <hr className="my-2" />
      <small className="inline-flex items-center gap-x-2 transition-colors group-hover:text-blue-500">
        Kelola {label} <ArrowRight size={12} />
      </small>
    </div>
  );
};

AdminStatisticCard.propTypes = {
  navigationPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default AdminStatisticCard;
