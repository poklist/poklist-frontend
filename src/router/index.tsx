import DeleteAccountPage from '@/pages/DeleteAccount';
import EditUserPage from '@/pages/EditUser';
import ErrorPage from '@/pages/Error';
import Home from '@/pages/Home/index';
import CreateIdeaPage from '@/pages/Idea/Create';
import EditIdeaPage from '@/pages/Idea/Edit';
import Layout from '@/pages/Layout';
import CreateListPage from '@/pages/Lists/Create';
import EditListPage from '@/pages/Lists/Edit';
import ListManagementPage from '@/pages/Lists/Manage';
import ViewListPage from '@/pages/Lists/View';
import Login from '@/pages/Login';
import SettingsPage from '@/pages/Settings';
import UserPage from '@/pages/User';
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Navigate to="/home" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'home', element: <Home /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: ':userCode', element: <UserPage /> },
      { path: ':userCode/edit', element: <EditUserPage /> },
      { path: ':userCode/delete', element: <DeleteAccountPage /> },
      { path: ':userCode/list/:id', element: <ViewListPage /> },
      { path: ':userCode/list/:id/idea/:ideaID', element: <ViewListPage /> },
      { path: ':userCode/list/create', element: <CreateListPage /> },
      { path: ':userCode/list/:id/manage', element: <ListManagementPage /> },
      { path: ':userCode/list/:id/edit', element: <EditListPage /> },
      { path: 'idea/create', element: <CreateIdeaPage /> },
      { path: 'idea/:id/edit', element: <EditIdeaPage /> },
      { path: 'error', element: <ErrorPage /> },
      { path: '*', element: <Navigate to="/error" replace /> },
    ],
  },
]);

export default router;
