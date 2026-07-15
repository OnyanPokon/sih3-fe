import { Action, Role } from '@/constants';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import * as Model from '@/models';
import { BellOutlined, DashboardOutlined, DatabaseOutlined, EnvironmentOutlined, EyeOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';

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
    label: 'Pos Pengamatan',
    key: '/jenis_pos',
    element: Landing.PosTypes
  },
  {
    label: 'Koordinat Telemetri',
    key: '/koordinat_telemetri',
    element: Landing.TelemetryCoordinates
  },
  {
    label: 'Produk Hukum',
    key: '/legal_products',
    element: Landing.LegalProducts
  },
  {
    label: 'Info H3',
    children: [
      {
        label: 'Hidrologi',
        key: '/news/hidrologi',
        element: Landing.PortalHidrologi
      },
      {
        label: 'Hidrometeorologi',
        key: '/news/hidrometeorologi',
        element: Landing.PortalHidrometeorologi
      },
      {
        label: 'Hidrogeologi',
        key: '/news/hidrogeologi',
        element: Landing.PortalHidrogeologi
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
    element: Dashboard.News,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    permissions: [[Action.READ, Model.News]]
  },
  {
    label: 'Produk Hukum',
    icon: FileOutlined,
    path: '/dashboard/legal_products',
    element: Dashboard.LegalProducts,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    permissions: [[Action.READ, Model.LegalProducts]]
  },
  {
    label: 'Jenis Pos',
    icon: BellOutlined,
    path: '/dashboard/pos_types',
    element: Dashboard.PosTypes,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    permissions: [[Action.READ, Model.PosTypes]]
  },
  {
    label: 'Pos Pengamatan',
    icon: EyeOutlined,
    path: '/dashboard/observation_pos',
    element: Dashboard.ObservationPos,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    permissions: [[Action.READ, Model.ObservationPos]]
  },
  {
    label: 'Artikel',
    icon: FileOutlined,
    path: '/dashboard/articles',
    element: Dashboard.Articles,
    roles: [Role.SUPERADMIN, Role.ADMIN],
    permissions: [[Action.READ, Model.Articles]]
  },
  {
    label: 'Kategori',
    icon: DatabaseOutlined,
    path: '/dashboard/categories',
    element: Dashboard.Categories,
    roles: [Role.SUPERADMIN, Role.ADMIN],
    permissions: [[Action.READ, Model.Categories]]
  },
  {
    label: 'Personil',
    icon: UserOutlined,
    roles: [Role.SUPERADMIN],
    children: [
      { path: '/dashboard/roles', label: 'Role', element: Dashboard.Roles, roles: [Role.SUPERADMIN] },
      { path: '/dashboard/permissions', label: 'Permission', element: Dashboard.Permissions, roles: [Role.SUPERADMIN] },
      { path: '/dashboard/unors', label: 'Unor', element: Dashboard.Unors, roles: [Role.SUPERADMIN], permissions: [[Action.READ, Model.Unors]] },
      { path: '/dashboard/personils', label: 'Personil', element: Dashboard.Personils, roles: [Role.SUPERADMIN], permissions: [[Action.READ, Model.Personils]] }
    ]
  },
  {
    label: 'Pemetaan',
    icon: EnvironmentOutlined,
    path: '/dashboard/maps',
    element: Dashboard.Map,
    roles: [Role.SUPERADMIN, Role.ADMIN],
    permissions: [[Action.READ, Model.Maps]]
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  },
  {
    path: '/auth/sso_login',
    element: Auth.SsoLogin
  },
  {
    path: '/callback',
    element: Auth.Callback
  }
];
