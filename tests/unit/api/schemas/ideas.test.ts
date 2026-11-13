import { ideasSchema } from '@/api/schemas';
import { describe, expect, it } from 'vitest';

describe('ideasSchema.getIdeasUnderListResponse', () => {
  it('accepts an ideas payload', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [
          {
            id: 'i1',
            title: 'T',
            description: '',
            coverImage: '',
            externalLink: '',
          },
        ],
        ideaTotalCount: 1,
      })
    ).not.toThrow();
  });

  it('accepts an empty ideas array', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: 0,
      })
    ).not.toThrow();
  });

  it('rejects a negative total', () => {
    expect(() =>
      ideasSchema.getIdeasUnderListResponse.parse({
        ideas: [],
        ideaTotalCount: -1,
      })
    ).toThrow();
  });
});
