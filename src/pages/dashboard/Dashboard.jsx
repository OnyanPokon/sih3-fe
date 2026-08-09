import { Role } from '@/constants';
import { useAuth } from '@/hooks';
import { Skeleton } from 'antd';
import AdminDashboard from './AdminDashboard';
import SuperadminDashboard from './SuperadminDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      {!user ? (
        <Skeleton active />
      ) : (
        <>
          {user.is(Role.ADMIN) && <AdminDashboard />}
          {user.is(Role.SUPERADMIN) && <SuperadminDashboard />}
        </>
      )}
    </>
  );
};

export default Dashboard;
