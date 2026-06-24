import { createResponseSchema } from '@/api/schemas/common';
import z from 'zod';

const getListsLimitsResponseSchema = createResponseSchema(
  z.object({
    usedCount: z.number().int(),
    limitCount: z.number().int(),
    remainingCount: z.number().int().nullable(),
    isUnlimited: z.boolean(),
  })
);

const getIdeasLimitsRequestSchema = z.object({ listID: z.string() });

const getIdeasLimitsResponseSchema = createResponseSchema(
  z.object({
    usedCount: z.number().int(),
    limitCount: z.number().int(),
    remainingCount: z.number().int().nullable(),
    isUnlimited: z.boolean(),
  })
);

export const publishSchema = {
  getListsLimitsResponse: getListsLimitsResponseSchema,
  getIdeasLimitsRequest: getIdeasLimitsRequestSchema,
  getIdeasLimitsResponse: getIdeasLimitsResponseSchema,
};
