import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Grid, Image, Menu, Tooltip } from 'antd';
import Sider from 'antd/es/layout/Sider';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardSider = ({ collapsed, onCloseMenu }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const breakpoints = Grid.useBreakpoint();

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  const canAccess = (roles = [], permissions = [], categories = []) => {
    const hasRole = roles.length === 0 || user?.eitherIs(...roles);

    const hasPermission = permissions.length === 0 || user?.eitherCan(...permissions);

    const hasCategory = !categories || categories.length === 0 || user?.categoryIs(categories);

    return hasRole && hasPermission && hasCategory;
  };

  const menuItems = dashboardLink
    .map(({ label, children, icon: Icon, roles = [], permissions = [], categories, path }) => {
      const visibleChildren = children
        ?.filter((child) => canAccess(child.roles, child.permissions, child.categories))
        .map((child) => ({
          key: child.path,
          label: (
            <Tooltip title={child.label} placement="right" color="blue">
              <span>{child.label}</span>
            </Tooltip>
          ),
          onClick: () => navigate(child.path)
        }));

      const isVisible = canAccess(roles, permissions, categories) || (visibleChildren && visibleChildren.length > 0);

      if (!isVisible) return null;

      return {
        key: label,
        label: (
          <Tooltip title={label} placement="right" color="blue">
            <span>{label}</span>
          </Tooltip>
        ),
        icon: (
          <Tooltip title={label} placement="right" color="blue">
            <Icon />
          </Tooltip>
        ),
        onClick: path ? () => navigate(path) : undefined,
        children: visibleChildren
      };
    })
    .filter(Boolean);

  return isDesktop ? (
    <Sider theme="light" className="p-4" width={260} collapsed={collapsed}>
      <Link to="/">
        <div className="mb-4 flex w-full items-center justify-center">
          <Image width={40} preview={false} src={'/image_asset/logo/prov_gto_logo.png'} />
        </div>
      </Link>
      <Menu className="w-full !border-none font-semibold" theme="light" mode="inline" defaultSelectedKeys={[pathname]} items={menuItems} />
    </Sider>
  ) : (
    <Drawer
      styles={{ body: { padding: 10 } }}
      placement="left"
      width={250}
      open={!collapsed}
      onClose={onCloseMenu}
      title={
        <Link to="/">
          <div className="flex w-full items-center justify-center">
            <Image width={40} preview={false} src={''} />
          </div>
        </Link>
      }
    >
      <Menu className="w-full !border-none font-semibold" theme="light" mode="inline" defaultSelectedKeys={[pathname]} items={menuItems} />
    </Drawer>
  );
};

export default DashboardSider;

DashboardSider.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCloseMenu: PropTypes.func.isRequired
};
