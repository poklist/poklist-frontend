import useIsMobile from '@/hooks/useIsMobile';
import router from '@/router';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry at most 1 time on failure
      staleTime: 1000 * 60, // Data within 1 minute is not refetched
      refetchOnWindowFocus: false, // Do not automatically refetch when switching back to the screen
    },
  },
});

function App() {
  useIsMobile();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <RouterProvider router={router} />
        </Theme>
        {/* Need to be outside of Theme or the toast will behind of the dialog */}
        <Toaster />
      </QueryClientProvider>
    </>
  );
}

export default App;
