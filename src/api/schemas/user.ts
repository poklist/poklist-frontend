import { SocialLinkType } from '@/enums/index.enum';
import z from 'zod';
import { createResponseSchema, userBriefSchema } from '@/api/schemas/common';

const userInfoSchema = userBriefSchema.extend({
  bio: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z.record(z.nativeEnum(SocialLinkType), z.string()).optional(),
  listCount: z.number().optional(),
  followerCount: z.number().optional(),
  followingCount: z.number().optional(),
  isFollowing: z.boolean().optional(),
});

const getInfoRequestSchema = z.object({ userCode: z.string() });

const getInfoResponseSchema = createResponseSchema(userInfoSchema);

export const userSchema = {
  getInfoRequest: getInfoRequestSchema,
  getInfoResponse: getInfoResponseSchema,
};
