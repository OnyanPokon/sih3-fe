import { Result } from 'antd';
import { Skeleton } from 'antd';
import { useAuth } from '@/hooks';
import PropTypes from 'prop-types';

/**
 * Guard component yang mengecek permission dan role secara reactive.
 * Dirender di dalam router sehingga router tidak perlu dibuat ulang saat user berubah.
 */
export default function PermissionGuard({ element: Element, permissions, roles }) {
  const { user, isLoading } = useAuth();

  // Selama token sedang diverifikasi, tampilkan skeleton — jangan langsung forbidden
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const hasPermissions = permissions && permissions.length > 0;
  const hasRoles = roles && roles.length > 0;
  const userCantDoAnyOfThat = hasPermissions && (!user || user.cantDoAny(...permissions));
  const userIsNotInAnyOfThatRole = hasRoles && (!user || !roles.some((role) => user.is(role)));

  if (userCantDoAnyOfThat || userIsNotInAnyOfThatRole) {
    return <Result status="403" subTitle="Anda tidak memiliki akses ke halaman ini" title="Forbidden" />;
  }

  return <Element />;
}

PermissionGuard.propTypes = {
  element: PropTypes.elementType.isRequired,
  permissions: PropTypes.array,
  roles: PropTypes.arrayOf(PropTypes.string)
};
