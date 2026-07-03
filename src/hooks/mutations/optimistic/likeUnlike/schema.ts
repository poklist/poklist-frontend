import { likeSchema, unlikeSchema } from '@/api/schemas';
import z from 'zod';

export const likeActionOptionsSchema = z.object({
  listID: z.string(),
  debounceMs: z.number().int().nonnegative().default(5000),
  shouldAllow: z.function().returns(z.boolean()).optional(),
  onNotAllowed: z.function().returns(z.void()).optional(),
  onSuccess: z
    .function()
    .args(
      z.union([
        likeSchema.postLikeResponse.shape.content,
        unlikeSchema.postUnlikeResponse.shape.content,
      ])
    )
    .returns(z.void())
    .optional(),
  onError: z
    .function()
    .args(
      z.unknown(),
      z.union([likeSchema.postLikeRequest, unlikeSchema.postUnlikeRequest])
    )
    .returns(z.void())
    .optional(),
});

export type LikeActionOptions = z.input<typeof likeActionOptionsSchema>;

export const likeActionReturnSchema = z.object({
  like: z.function().returns(z.void()),
  unlike: z.function().returns(z.void()),
  cancelPending: z.function().returns(z.void()),
  isLoading: z.boolean(),
  isPending: z.boolean(),
  isError: z.boolean(),
  isSuccess: z.boolean(),
  error: z.unknown(),
  data: z.unknown(),
});

export type LikeActionReturn = z.infer<typeof likeActionReturnSchema>;
