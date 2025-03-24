import useIsMobile from '@/hooks/useIsMobile';
import router from '@/router';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

function App() {
  useIsMobile();
  return (
    <>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
      {/* Need to be outside of Theme or the toast will behind of the dialog */}
      <Toaster />
    </>
  );
}

export default App;
