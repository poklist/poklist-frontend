import { RouterProvider } from 'react-router-dom';
import router from './router';

import MainContainer from './components/ui/containers/MainContainer';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
