import { authLink, dashboardLink, landingLink } from './data/link';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { flattenLandingLinks } from './utils/landingLink';
import { Notfound } from './pages/result';
import { CreateArticles, CreateNews, EditArticles, EditNews, Kuesioners, ProfileSettings, Settings, TelemetryCoordinates } from './pages/dashboard';
import { ObservationPos, ReadArticle, ReadNews } from './pages/landing';
import { PermissionGuard } from './components';

/**
 * Router dibuat sekali di luar komponen agar tidak pernah di-recreate.
 * Permission check dilakukan secara reactive di dalam komponen PermissionGuard.
 */
const flatLandingLinks = flattenLandingLinks(landingLink);

const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      ...flatLandingLinks.map(({ path, element: Element }) => ({
        path,
        element: <Element />
      })),
      { path: '/news/:prefix/:slug', element: <ReadNews /> },
      { path: '/article/:prefix/:slug', element: <ReadArticle /> },
      { path: '/pos_pengamatan/:pos_type_id', element: <ObservationPos /> },
      { path: '*', element: <Notfound /> }
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      ...dashboardLink.flatMap(({ path, element: Element, permissions, roles, children }) => {
        if (children && children.length > 0) {
          return children.map(({ permissions, roles, path, element: Element }) => {
            const hasPermissions = permissions && permissions.length > 0;
            const hasRoles = roles && roles.length > 0;

            if (hasPermissions || hasRoles) {
              return {
                path,
                element: <PermissionGuard element={Element} permissions={permissions} roles={roles} />
              };
            }

            return { path, element: <Element /> };
          });
        }

        if (path && Element) {
          const hasPermissions = permissions && permissions.length > 0;
          const hasRoles = roles && roles.length > 0;

          if (hasPermissions || hasRoles) {
            return [
              {
                path,
                element: <PermissionGuard element={Element} permissions={permissions} roles={roles} />
              }
            ];
          }

          return [{ path, element: <Element /> }];
        }
        return [];
      }),
      { path: '/dashboard/news/create', element: <CreateNews /> },
      { path: '/dashboard/articles/create', element: <CreateArticles /> },
      { path: '/dashboard/news/edit/:slug', element: <EditNews /> },
      { path: '/dashboard/articles/edit/:slug', element: <EditArticles /> },
      { path: '/dashboard/articles/kuesioners/:id_artikel', element: <Kuesioners /> },
      { path: '/dashboard/profile-settings', element: <ProfileSettings /> },
      { path: '/dashboard/settings', element: <Settings /> },
      { path: '/dashboard/telemetry_coordinate/:pos_pengamatan_id', element: <TelemetryCoordinates /> }
    ]
  },
  {
    element: <AuthLayout />,
    children: authLink.map(({ path, element: Element }) => ({
      path,
      element: <Element />
    }))
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
