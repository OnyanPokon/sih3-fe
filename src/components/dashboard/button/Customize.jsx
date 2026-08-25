import { Action } from '@/constants';
import { useAuth } from '@/hooks';
import { BgColorsOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

export default function Customize({ title = 'Kustomisasi Tampilan Peta', onClick, model, action = Action.UPDATE }) {
  const { user } = useAuth();
  if (action !== Action.NONE && (!user || user.cant(action, model))) return null;

  return (
    <Tooltip title={title}>
      <Button
        variant="outlined"
        color="purple"
        shape="circle"
        icon={<BgColorsOutlined />}
        onClick={onClick}
      />
    </Tooltip>
  );
}

Customize.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  model: PropTypes.func.isRequired,
  action: PropTypes.oneOf(Object.values(Action))
};
