import Discovery from '@/pages/Discovery';
import EditUserPage from '@/pages/EditUser';
import ErrorPage from '@/pages/Error';
import GoToMobilePage from '@/pages/GoToMobile';
import CreateIdeaPage from '@/pages/Idea/Create';
import EditIdeaPage from '@/pages/Idea/Edit';
import Layout from '@/pages/Layout/index';
import UserRouteLayout from '@/pages/Layout/UserRouteLayuout';
import CreateListPage from '@/pages/Lists/Create';
import EditListPage from '@/pages/Lists/Edit';
import ListManagementPage from '@/pages/Lists/Manage';
import ViewListPage from '@/pages/Lists/View';
import Official from '@/pages/Official/index';
import SettingsPage from '@/pages/Settings';
import UserPage from '@/pages/User';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const StaticRoutes = {
  HOME: '/',
  DISCOVERY: '/discovery',
  OFFICIAL: '/official',
  SETTINGS: '/settings',
  GO_TO_MOBILE: '/goToMobile',
  ERROR: '/error',
};

const router = createBrowserRouter([
  {
    path: StaticRoutes.HOME,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Navigate to={StaticRoutes.DISCOVERY} replace /> },
      { path: StaticRoutes.DISCOVERY, element: <Discovery /> },
      { path: StaticRoutes.OFFICIAL, element: <Official /> },
      { path: StaticRoutes.SETTINGS, element: <SettingsPage /> },
      { path: StaticRoutes.ERROR, element: <ErrorPage /> },
      { path: StaticRoutes.GO_TO_MOBILE, element: <GoToMobilePage /> },
      { path: 'user/edit', element: <EditUserPage /> },
      { path: 'list/create', element: <CreateListPage /> },
      { path: 'idea/create', element: <CreateIdeaPage /> },
      { path: 'idea/:id/edit', element: <EditIdeaPage /> },
      {
        path: ':userCode',
        element: <UserRouteLayout />,
        children: [
          { path: '', element: <UserPage /> },
          { path: 'list/:id', element: <ViewListPage /> },
          {
            path: 'list/:id/idea/:ideaID',
            element: <ViewListPage />,
          },
          {
            path: 'list/:id/manage',
            element: <ListManagementPage />,
          },
          { path: 'list/:id/edit', element: <EditListPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/error" replace /> },
    ],
  },
]);

export default router;
