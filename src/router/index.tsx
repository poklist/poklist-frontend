import CreatePage from '@/pages/Create';
import Home from '@/pages/Home/index';
import Layout from '@/pages/Layout';
import Idea from '@/pages/Idea';
import List from '@/pages/List';
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
  {
    path: '/list/:id',
    element: <List />,
  },
  {
    path: '/idea/:id',
    element: <Idea />,
  },
]);

export default router;
