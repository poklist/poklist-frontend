import { InfiniteCache, TsRestCacheEntry } from '@/api/fetcher';
import { QueryClient, QueryKey } from '@tanstack/react-query';
import { AppRoute, ClientInferResponseBody } from '@ts-rest/core';

export const updateEntryCaches = <T extends AppRoute>(
  queryClient: QueryClient,
  key: QueryKey,
  updater: (
    previousCaches: ClientInferResponseBody<T>
  ) => ClientInferResponseBody<T>
) => {
  queryClient.setQueryData<TsRestCacheEntry<ClientInferResponseBody<T>>>(
    key,
    (caches) => {
      if (!caches) return undefined;
      return {
        ...caches,
        body: updater(caches.body),
      };
    }
  );
};

export const updateInfiniteCaches = <T extends AppRoute>(
  queryClient: QueryClient,
  key: QueryKey,
  updater: (
    previousCaches: TsRestCacheEntry<ClientInferResponseBody<T>>[]
  ) => TsRestCacheEntry<ClientInferResponseBody<T>>[]
) => {
  queryClient.setQueryData<InfiniteCache<ClientInferResponseBody<T>>>(
    key,
    (caches) => {
      if (!caches) return undefined;
      return {
        ...caches,
        pages: updater(caches.pages),
      };
    }
  );
};
