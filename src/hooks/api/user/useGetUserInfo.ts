import { userContract } from '@/api/contracts';
import { userQuery } from '@/api/query/user';
import { userSchema } from '@/api/schemas';
import { ErrorResponse } from '@ts-rest/react-query';
import { useEffect } from 'react';
import z from 'zod';
import userKeys from '@/hooks/api/user/keys';

const getUserInfoSchema = userSchema.getInfoRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type GetUserInfoOptions = z.input<typeof getUserInfoSchema> & {
  onError?: (error: ErrorResponse<typeof userContract.getInfoContract>) => void;
};

export const useGetUserInfo = (options: GetUserInfoOptions) => {
  const { userCode, staleTime, gcTime } = getUserInfoSchema.parse(options);
  const { onError } = options;

  const query = userQuery.getInfo.useQuery(
    userKeys.userInfo(userCode),
    { params: { userCode } },
    {
      queryKey: userKeys.userInfo(userCode),
      staleTime,
      gcTime,
      enabled: !!userCode,
    }
  );

  useEffect(() => {
    if (query.error && onError) {
      onError(query.error);
    }
  }, [query.error, onError]);

  return {
    ...query,
    data: query.data?.body.content,
  };
};
