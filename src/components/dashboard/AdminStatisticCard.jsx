import { FolderFilled } from "@ant-design/icons"
import { ArrowRight } from "lucide-react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

const AdminStatisticCard = ({ navigationPath, label, value }) => {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(navigationPath)}
            className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer col-span-3 border p-4 rounded-lg border-gray-200 flex flex-col"
        >
            <FolderFilled className="text-blue-700 text-3xl mb-2" />
            <p className="font-semibold group-hover:">
                {label}
            </p>
            <span className="text-xs font-semibold text-gray-500">
                {value} Item
            </span>
            <hr className="my-2" />
            <small className='inline-flex items-center gap-x-2 group-hover:text-blue-500 transition-colors '>
                Kelola {label} <ArrowRight size={12} />
            </small>
        </div>
    )
}

AdminStatisticCard.propTypes = {
  navigationPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default AdminStatisticCard