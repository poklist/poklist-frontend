import useIsMobile from '@/hooks/useIsMobile';
import router from '@/router';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { RouterProvider } from 'react-router-dom';

function App() {
  useIsMobile();
  return (
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  );
}

export default App;
