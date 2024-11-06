import AlertComponent from '@/components/ui/Alert';
import CreatePage from '@/pages/Create';
import Home from '@/pages/Home/index';
import Login from '@/pages/Login';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  // children: [
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'create',
    element: (
      <>
        <CreatePage />
        <AlertComponent />
      </>
    ),
  },
  // ]
]);

export default router;
