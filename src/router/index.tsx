import GoogleLogin from '@/pages/GoogleLogin';
import Home from '@/pages/Home/index';
import Login from '@/pages/Login';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/google/login',
    element: <GoogleLogin />,
  },
  {
    path: '/home',
    element: <Home />,
  },
]);

export default router;
