import { Action, Role } from '@/constants';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import * as Model from '@/models';
import {CameraOutlined, CompassOutlined, DashboardOutlined, DatabaseOutlined, EnvironmentOutlined, SettingOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import DefaultCategories from '@/constants/DefaultCategories';

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
    label: 'Pos Pengamatan',
    icon: CompassOutlined,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    children: [
      { path: '/dashboard/pos_types', label: 'Jenis Pos', element: Dashboard.PosTypes, roles: [Role.ADMIN, Role.SUPERADMIN] },
      { path: '/dashboard/observation_pos', label: 'Pos Pengamatan', element: Dashboard.ObservationPos, roles: [Role.ADMIN, Role.SUPERADMIN] },
    ]
  },
  {
    label: 'Publikasi',
    icon: CameraOutlined,
    roles: [Role.ADMIN, Role.SUPERADMIN],
    children: [
      { path: '/dashboard/news', label: 'Berita', element: Dashboard.News, roles: [Role.ADMIN, Role.SUPERADMIN] },
      { path: '/dashboard/articles', label: 'Informasi Teknis', element: Dashboard.Articles, roles: [Role.ADMIN, Role.SUPERADMIN] },
      { path: '/dashboard/legal_products', label: 'Produk Hukum', element: Dashboard.LegalProducts, roles: [Role.ADMIN, Role.SUPERADMIN] },
    ]
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
    label: 'Wilayah Sungai',
    icon: DatabaseOutlined,
    path: '/dashboard/wilayah-sungai',
    element: Dashboard.WilayahSungai,
    roles: [Role.SUPERADMIN, Role.ADMIN],
    permissions: [[Action.READ, Model.WilayahSungai]],
    categories: [
      DefaultCategories.HIDROLOGI,
    ]
  },
  {
    label: 'Wilayah Sungai',
    icon: DatabaseOutlined,
    path: '/dashboard/wilayah-sungai',
    element: Dashboard.WilayahSungai,
    roles: [Role.SUPERADMIN],
    permissions: [[Action.READ, Model.WilayahSungai]],
  },
  {
    label: 'Tag',
    icon: TagOutlined,
    path: '/dashboard/tags',
    element: Dashboard.Tags,
    roles: [Role.SUPERADMIN, Role.ADMIN]
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
  },
  {
    label: 'Pengaturan',
    icon: SettingOutlined,
    path: '/dashboard/settings',
    element: Dashboard.Settings
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
  },
  {
    path: '/auth/forget_password',
    element: Auth.ForgetPassword
  }
];
