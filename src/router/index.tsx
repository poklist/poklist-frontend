import CreatePage from '@/pages/Create';
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
        path: 'users',
        element: (
          <>
            <UserPage />
          </>
        ),
        children: [
          {
            path: '',
            element: <UserPage />,
          },
          {
            path: ':id',
            element: <UserPage />,
          },
        ],
      },
      {
        path: 'create',
        element: (
          <>
            <CreatePage />
          </>
        ),
      },
    ],
  },
]);

export default router;
