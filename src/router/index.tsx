import CreateListPage from '@/pages/CreateList';
import EditUserPage from '@/pages/EditUser';
import Home from '@/pages/Home/index';
import Layout from '@/pages/Layout';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
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
        element: <Settings />,
      },
      {
        path: ':id',
        element: (
          <>
            <UserPage />
          </>
        ),
      },
      {
        path: 'user/edit',
        element: (
          <>
            <EditUserPage />
          </>
        ),
      },
      {
        path: 'create',
        element: (
          <>
            <CreateListPage />
          </>
        ),
      },
    ],
  },
]);

export default router;
