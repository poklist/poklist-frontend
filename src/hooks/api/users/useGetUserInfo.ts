import { usersContract } from '@/api/contracts';
import { usersQuery } from '@/api/query/users';
import { usersSchema } from '@/api/schemas';
import usersKeys from '@/hooks/api/users/keys';
import { ErrorResponse } from '@ts-rest/react-query';
import { useEffect } from 'react';
import z from 'zod';

const getUserInfoSchema = usersSchema.getInfoRequest.extend({
  staleTime: z.number().int().nonnegative().default(60000),
  gcTime: z.number().int().nonnegative().default(300000),
});

type GetUserInfoOptions = z.input<typeof getUserInfoSchema> & {
  onError?: (
    error: ErrorResponse<typeof usersContract.getInfoContract>
  ) => void;
};

export const useGetUserInfo = (options: GetUserInfoOptions) => {
  const { userCode, staleTime, gcTime } = getUserInfoSchema.parse(options);
  const { onError } = options;

  const query = usersQuery.getInfo.useQuery(
    usersKeys.userInfo(userCode),
    { params: { userCode } },
    {
      queryKey: usersKeys.userInfo(userCode),
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
