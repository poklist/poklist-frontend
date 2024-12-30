import DeleteAccountPage from '@/pages/DeleteAccount';
import EditUserPage from '@/pages/EditUser';
import Home from '@/pages/Home/index';
import CreateIdeaPage from '@/pages/Idea/Create';
import Layout from '@/pages/Layout';
import CreateListPage from '@/pages/Lists/Create';
import ListManagementPage from '@/pages/Lists/Manage';
import Login from '@/pages/Login';
import SettingsPage from '@/pages/Settings';
import UserPage from '@/pages/User';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'delete-account',
        element: <DeleteAccountPage />,
      },
      {
        path: ':id',
        element: <UserPage />,
      },
      {
        path: 'user/edit',
        element: <EditUserPage />,
      },
      { path: 'list/create', element: <CreateListPage /> },
      { path: 'list/manage/:id', element: <ListManagementPage /> },
      // { path: 'list/edit/:id', element: <EditListPage /> },
      { path: 'idea/create', element: <CreateIdeaPage /> },
    ],
  },
]);

export default router;
