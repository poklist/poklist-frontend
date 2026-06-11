import axios from '@/api/axios';
import { isAbortWhitelist } from '@/api/whitelist';
import { InfiniteData } from '@tanstack/react-query';
import { ApiFetcherArgs } from '@ts-rest/core';
import { AxiosHeaders, isAxiosError, RawAxiosResponseHeaders } from 'axios';

const buildHeaders = (
  rawHeaders: RawAxiosResponseHeaders | AxiosHeaders
): Headers => {
  const nativeHeaders = new Headers();
  Object.entries(rawHeaders).forEach(([key, value]: [string, unknown]) => {
    if (Array.isArray(value)) {
      value.forEach((v: unknown) => {
        if (typeof v === 'string') nativeHeaders.append(key, v);
      });
    } else if (['string', 'number', 'boolean'].includes(typeof value)) {
      nativeHeaders.append(key, String(value));
    }
  });

  return nativeHeaders;
};

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

  try {
    const response = await axios<T>({
      url: path,
      method,
      headers,
      data: body,
      signal,
    });

    return {
      status: response.status,
      body: response.data,
      headers: buildHeaders(response.headers),
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        body: error.response.data as T, // error body 由 ts-rest 按 status 對應 contract
        headers: buildHeaders(error.response.headers),
      };
    }
    throw error; // network error / cancel
  }
};

export type TsRestCacheEntry<TBody> = {
  status: number;
  body: TBody;
  headers: Headers;
};

export type TanStackCache<TBody> = TsRestCacheEntry<TBody>;

export type InfiniteCache<TBody> = InfiniteData<
  TsRestCacheEntry<TBody>,
  number
>;
