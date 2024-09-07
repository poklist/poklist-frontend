import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import Home from '@/pages/Home/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
]);

export default router;