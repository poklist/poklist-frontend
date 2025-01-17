import DeleteAccountPage from '@/pages/DeleteAccount';
import EditUserPage from '@/pages/EditUser';
import Home from '@/pages/Home/index';
import CreateIdeaPage from '@/pages/Idea/Create';
import Layout from '@/pages/Layout';
import CreateListPage from '@/pages/Lists/Create';
import EditListPage from '@/pages/Lists/Edit';
import ListManagementPage from '@/pages/Lists/Manage';
import Login from '@/pages/Login';
import SettingsPage from '@/pages/Settings';
import UserPage from '@/pages/User';
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to="/home" replace />,
      },
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
      { path: 'list/edit/:id', element: <EditListPage /> },
      { path: 'idea/create', element: <CreateIdeaPage /> },
    ],
  },
]);

export default router;
