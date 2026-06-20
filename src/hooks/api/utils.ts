import { InfiniteCache, TsRestCacheEntry } from '@/api/fetcher';
import { QueryClient, QueryKey } from '@tanstack/react-query';
import { AppRoute, ClientInferResponseBody } from '@ts-rest/core';

export const updateEntryCaches = <
  T extends AppRoute,
  TStatus extends keyof T['responses'] & number = 200,
>(
  queryClient: QueryClient,
  key: QueryKey,
  updater: (
    previousCaches: ClientInferResponseBody<T, TStatus>
  ) => ClientInferResponseBody<T, TStatus>
) => {
  queryClient.setQueryData<
    TsRestCacheEntry<ClientInferResponseBody<T, TStatus>>
  >(key, (caches) => {
    if (!caches) return undefined;
    return {
      ...caches,
      body: updater(caches.body),
    };
  });
};

export const updateInfiniteCaches = <
  T extends AppRoute,
  TStatus extends keyof T['responses'] & number = 200,
>(
  queryClient: QueryClient,
  key: QueryKey,
  updater: (
    previousCaches: TsRestCacheEntry<ClientInferResponseBody<T, TStatus>>[]
  ) => TsRestCacheEntry<ClientInferResponseBody<T, TStatus>>[]
) => {
  queryClient.setQueryData<InfiniteCache<ClientInferResponseBody<T, TStatus>>>(
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
