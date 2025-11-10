import { Role } from '@/constants';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { DashboardOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  },
  {
    label: 'Pemetaan',
    key: '/pemetaan',
    element: Landing.Map
  }
];

/**
 * @type {{
 *  label: string;
 *  permissions: [Action, import('@/models/Model').ModelChildren][];
 *  roles: Role[];
 *  children: {
 *   path: string;
 *   label: string;
 *   icon: import('react').ReactNode;
 *   element: import('react').ReactNode;
 *   roles?: Role[];
 *   permissions?: [Action, import('@/models/Model').ModelChildren][];
 *  }[];
 * }[]}
 */
export const dashboardLink = [
  {
    label: 'Dashboard',
    icon: DashboardOutlined,
    path: '/dashboard',
    element: Dashboard.Dashboard
  },
  {
    label: 'Unor',
    icon: IdcardOutlined,
    path: '/unors',
    element: Dashboard.Unors
  },
  {
    label: 'Pemetaan',
    icon: EnvironmentOutlined,
    roles: [Role.ADMIN],
    children: [
      { path: '/dashboard/maps', label: 'Peta', element: Dashboard.Dashboard, roles: [Role.ADMIN] },
      { path: '/dashboard/categories', label: 'Kategori', element: Dashboard.Categories, roles: [Role.ADMIN] }
    ]
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
