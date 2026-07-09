import { isServer, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          const axiosError = error as AxiosError;
          const statusCode = axiosError.response?.status;

          if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
            return false;
          }

          if (failureCount >= 1) {
            return false;
          }

          return true;
        },
        staleTime: 60000,
        gcTime: 300000,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
};
