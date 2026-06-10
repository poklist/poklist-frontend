import { createResponseSchema, userBriefSchema } from '@/api/schemas/common';
import { SocialLinkType } from '@/enums/index.enum';
import z from 'zod';

const userInfoSchema = userBriefSchema.extend({
  bio: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z.record(z.nativeEnum(SocialLinkType), z.string()).optional(),
  listCount: z.number().int().nonnegative().optional(),
  followerCount: z.number().int().nonnegative().optional(),
  followingCount: z.number().int().nonnegative().optional(),
  isFollowing: z.boolean().optional(),
});

const getInfoRequestSchema = z.object({ userCode: z.string() });

const getInfoResponseSchema = createResponseSchema(
  userInfoSchema.extend({
    listCount: z.number().int().nonnegative(),
  })
);

const putRequestSchema = userInfoSchema.extend({
  profileImage: z.string().nullable().optional().or(z.literal('')),
});

const putResponseSchema = createResponseSchema(
  putRequestSchema.extend({ accessToken: z.string() })
);

export const usersSchema = {
  getInfoRequest: getInfoRequestSchema,
  getInfoResponse: getInfoResponseSchema,
  putRequest: putRequestSchema,
  putResponse: putResponseSchema,
};
