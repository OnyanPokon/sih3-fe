import { Action, Role } from '@/constants';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import * as Model from '@/models';
import { DashboardOutlined, EnvironmentOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';

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
  },
  {
    label: 'Berita',
    children: [
      {
        label: 'Hidrologi',
        key: '/news/hidrologi',
        element: Landing.Map
      },
      {
        label: 'Hidrometerologi',
        key: '/news/hidrometerologi',
        element: Landing.Map
      },
      {
        label: 'Hidrogeologi',
        key: '/news/hidrogeologi',
        element: Landing.Map
      }
    ]
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
    label: 'Berita',
    icon: FileOutlined,
    path: '/dashboard/news',
    element: Dashboard.News
  },
  {
    label: 'Personil',
    icon: UserOutlined,
    roles: [Role.ADMIN],
    children: [
      { path: '/dashboard/unors', label: 'Unor', element: Dashboard.Unors, roles: [Role.ADMIN] },
      { path: '/dashboard/personils', label: 'Personil', element: Dashboard.Personils, roles: [Role.ADMIN], permissions: [[Action.READ, Model.Personils]] }
    ]
  },
  {
    label: 'Pemetaan',
    icon: EnvironmentOutlined,
    roles: [Role.ADMIN],
    children: [
      { path: '/dashboard/maps', label: 'Peta', element: Dashboard.Map, roles: [Role.ADMIN] },
      { path: '/dashboard/categories', label: 'Kategori', element: Dashboard.Categories, roles: [Role.ADMIN], permissions: [[Action.READ, Model.Categories]] }
    ]
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
