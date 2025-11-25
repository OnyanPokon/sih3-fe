import { Result } from 'antd';
import { authLink, dashboardLink, landingLink } from './data/link';
import { useAuth } from './hooks';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { flattenLandingLinks } from './utils/landingLink';
import { Notfound } from './pages/result';
import { CreateArticles, CreateNews, EditArticles, EditNews, Kuesioners, ProfileSettings, TelemetryCoordinates } from './pages/dashboard';
import { News, ObservationPos, ReadArticle, ReadNews } from './pages/landing';

function App() {
  const { user } = useAuth();
  const flatLandingLinks = flattenLandingLinks(landingLink);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <LandingLayout />,
          children: [
            { path: '/news/:prefix', element: <News /> },
            // Tambahkan route dari landingLink
            ...flatLandingLinks
              .filter((route) => !route.path.startsWith('/news/'))
              .map(({ path, element: Element }) => ({
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
                  const userCantDoAnyOfThat = hasPermissions && (!user || user.cantDoAny(...permissions));
                  const userIsNotInAnyOfThatRole = hasRoles && (!user || !roles.some((role) => user.is(role)));

                  if (userCantDoAnyOfThat || userIsNotInAnyOfThatRole) {
                    return {
                      path,
                      element: <Result status="403" subTitle="Anda tidak memiliki akses ke halaman ini" title="Forbidden" />
                    };
                  }

                  return { path, element: <Element /> };
                });
              }

              if (path && Element) {
                const hasPermissions = permissions && permissions.length > 0;
                const hasRoles = roles && roles.length > 0;
                const userCantDoAnyOfThat = hasPermissions && (!user || user.cantDoAny(...permissions));
                const userIsNotInAnyOfThatRole = hasRoles && (!user || !roles.some((role) => user.is(role)));

                if (userCantDoAnyOfThat || userIsNotInAnyOfThatRole) {
                  return [
                    {
                      path,
                      element: <Result status="403" subTitle="Anda tidak memiliki akses ke halaman ini" title="Forbidden" />
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
      ])}
    />
  );
}

export default App;
