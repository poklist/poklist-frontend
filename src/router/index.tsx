import Discovery from '@/pages/Discovery';
import EditUserPage from '@/pages/EditUser';
import ErrorPage from '@/pages/Error';
import GoToMobilePage from '@/pages/GoToMobile';
import Home from '@/pages/Home/index';
import CreateIdeaPage from '@/pages/Idea/Create';
import EditIdeaPage from '@/pages/Idea/Edit';
import Layout from '@/pages/Layout/index';
import UserRouteLayout from '@/pages/Layout/UserRouteLayuout';
import CreateListPage from '@/pages/Lists/Create';
import EditListPage from '@/pages/Lists/Edit';
import ListManagementPage from '@/pages/Lists/Manage';
import ViewListPage from '@/pages/Lists/View';
import SettingsPage from '@/pages/Settings';
import UserPage from '@/pages/User';
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Navigate to="/discovery" replace /> },
      { path: 'discovery', element: <Discovery /> },
      { path: 'home', element: <Home /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'error', element: <ErrorPage /> },
      { path: 'goToMobile', element: <GoToMobilePage /> },
      { path: 'idea/create', element: <CreateIdeaPage /> },
      { path: 'idea/:id/edit', element: <EditIdeaPage /> },
      {
        path: ':userCode',
        element: <UserRouteLayout />,
        children: [
          { path: '', element: <UserPage /> },
          { path: 'edit', element: <EditUserPage /> },
          { path: 'list/:id', element: <ViewListPage /> },
          {
            path: 'list/:id/idea/:ideaID',
            element: <ViewListPage />,
          },
          { path: 'list/create', element: <CreateListPage /> },
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
