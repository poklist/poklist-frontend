import axios from '@/api/axios';
import { isAbortWhitelist } from '@/api/whitelist';
import { ApiFetcherArgs } from '@ts-rest/core';

export const axiosFetcher = async <T = unknown>({
  path,
  method,
  headers,
  body,
  fetchOptions,
}: ApiFetcherArgs): Promise<{
  status: number;
  body: T;
  headers: Headers;
}> => {
  const isInWhitelist = isAbortWhitelist(method, path);
  const signal = isInWhitelist
    ? undefined
    : (fetchOptions?.signal ?? undefined);

  const response = await axios<T>({
    url: path,
    method,
    headers,
    data: body,
    signal,
  });

  const nativeHeaders = new Headers();
  Object.entries(response.headers).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      nativeHeaders.append(key, String(value));
    }
  });

  return {
    status: response.status,
    body: response.data,
    headers: nativeHeaders,
  };
};
