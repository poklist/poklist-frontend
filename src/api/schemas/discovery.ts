import { createResponseSchema, userBriefSchema } from '@/api/schemas/common';
import { IdeaFormSchema } from '@/types/common';
import z from 'zod';

const latestListSchema = z.object({
  id: z.number().int().nonnegative(),
  title: IdeaFormSchema.shape.title,
  owner: userBriefSchema,
});

const getLatestListGroupsSchema = createResponseSchema(
  z.record(z.array(latestListSchema))
);

const officialCollectionSchema = z.object({
  id: z.number().int().nonnegative(),
  title: IdeaFormSchema.shape.title,
  coverImage: IdeaFormSchema.shape.coverImage,
  owner: userBriefSchema,
});

const getOfficialCollectionsSchema = createResponseSchema(
  z.array(officialCollectionSchema)
);

export const discoverySchema = {
  latestListGroups: {
    getResponse: getLatestListGroupsSchema,
  },
  officialCollections: {
    getResponse: getOfficialCollectionsSchema,
  },
};
