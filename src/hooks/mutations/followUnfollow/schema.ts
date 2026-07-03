import { followSchema, unfollowSchema } from '@/api/schemas';
import z from 'zod';

const followTargetSchema = z.object({
  userCode: z.string(),
  userID: z.number().int().nonnegative(),
});

export type FollowTarget = z.infer<typeof followTargetSchema>;

export const followActionOptionsSchema = z.object({
  target: followTargetSchema,
  listOwner: followTargetSchema.optional(),
  currentUserCode: followTargetSchema.shape.userCode,
  currentUserID: followTargetSchema.shape.userID,
  debounceMs: z.number().int().nonnegative().default(5000),
  shouldAllow: z.function().returns(z.boolean()).optional(),
  onNotAllowed: z.function().returns(z.void()).optional(),
  onSuccess: z
    .function()
    .args(
      z.union([
        followSchema.postFollowResponse.shape.content,
        unfollowSchema.postUnfollowResponse.shape.content,
      ])
    )
    .returns(z.void())
    .optional(),
  onError: z
    .function()
    .args(
      z.unknown(),
      z.union([
        followSchema.postFollowRequest,
        unfollowSchema.postUnfollowRequest,
      ])
    )
    .returns(z.void())
    .optional(),
});

export type FollowActionOptions = z.input<typeof followActionOptionsSchema>;

export const followActionReturnSchema = z.object({
  follow: z.function().returns(z.void()),
  unfollow: z.function().returns(z.void()),
  cancelPending: z.function().returns(z.void()),
  isLoading: z.boolean(),
  isPending: z.boolean(),
  isError: z.boolean(),
  isSuccess: z.boolean(),
  error: z.unknown(),
  data: z.unknown(),
});

export type FollowActionReturn = z.infer<typeof followActionReturnSchema>;
