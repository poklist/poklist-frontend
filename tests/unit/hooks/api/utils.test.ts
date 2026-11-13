import { updateEntryCaches, updateInfiniteCaches } from '@/hooks/api/utils';
import { QueryClient } from '@tanstack/react-query';
import { AppRoute } from '@ts-rest/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

// A minimal stand-in contract, shaped like the real ones under
// src/api/contracts (e.g. listsContract.getListsContract): a GET route whose
// 200 response is { code, message, content, offset, limit, totalElements }.
// The helpers under test are generic over any AppRoute, so a small fixture
// keeps these tests focused on cache-update behaviour instead of coupling
// them to the real, much larger list-response schema.
export const fakeContract = {
  method: 'GET',
  path: '/fake/:id',
  responses: {
    200: z.object({
      code: z.string(),
      message: z.string(),
      content: z.object({ title: z.string() }),
      offset: z.number(),
      limit: z.number(),
      totalElements: z.number(),
    }),
  },
} satisfies AppRoute;

type FakeRoute = typeof fakeContract;

const entry = (title: string) => ({
  status: 200,
  body: {
    code: '0000',
    message: 'ok',
    content: { title },
    offset: 0,
    limit: 3,
    totalElements: 1,
  },
  headers: new Headers(),
});

describe('updateEntryCaches', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('applies the updater to an existing cache', () => {
    queryClient.setQueryData(['k'], entry('before'));
    updateEntryCaches<FakeRoute>(queryClient, ['k'], (body) => ({
      ...body,
      content: { ...body.content, title: 'after' },
    }));
    const result = queryClient.getQueryData<ReturnType<typeof entry>>(['k']);
    expect(result?.body.content.title).toBe('after');
  });

  it('is a no-op when the cache is absent', () => {
    updateEntryCaches<FakeRoute>(queryClient, ['missing'], (body) => body);
    expect(queryClient.getQueryData(['missing'])).toBeUndefined();
  });
});

describe('updateInfiniteCaches', () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('replaces pages via the updater', () => {
    queryClient.setQueryData(['inf'], {
      pages: [entry('p1'), entry('p2')],
      pageParams: [0, 1],
    });

    updateInfiniteCaches<FakeRoute>(queryClient, ['inf'], (pages) =>
      pages.map((page) => ({
        ...page,
        body: { ...page.body, content: { ...page.body.content, title: 'x' } },
      }))
    );

    const result = queryClient.getQueryData<{
      pages: ReturnType<typeof entry>[];
    }>(['inf']);
    expect(result?.pages.map((p) => p.body.content.title)).toEqual(['x', 'x']);
  });

  it('preserves pageParams', () => {
    queryClient.setQueryData(['inf'], {
      pages: [entry('p1')],
      pageParams: [0],
    });
    updateInfiniteCaches<FakeRoute>(queryClient, ['inf'], (pages) => pages);
    const result = queryClient.getQueryData<{ pageParams: number[] }>(['inf']);
    expect(result?.pageParams).toEqual([0]);
  });

  it('is a no-op when the cache is absent', () => {
    updateInfiniteCaches<FakeRoute>(queryClient, ['missing'], (pages) => pages);
    expect(queryClient.getQueryData(['missing'])).toBeUndefined();
  });
});
