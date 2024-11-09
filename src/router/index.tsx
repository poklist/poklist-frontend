import CreatePage from '@/pages/Create';
import Home from '@/pages/Home/index';
import Layout from '@/pages/Layout';
import Login from '@/pages/Login';
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
