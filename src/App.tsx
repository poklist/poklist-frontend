import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  );
}

export default App;
