import ApiPath from '@/constants/apiPath';
import QueryKeys from '@/constants/queryKeys';
import axios from '@/lib/axios';
import { SocialLink } from '@/types/Relation';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseFollowersOptions {
  userID?: number;
  staleTime?: number;
  gcTime?: number;
  onError?: (error: Error) => void;
}

const useFollowers = ({
  userID,
  staleTime = 60000, // 1 min
  gcTime = 300000, // 5 mins
  onError,
}: UseFollowersOptions) => {
  const query = useQuery({
    queryKey: [QueryKeys.FOLLOWERS, userID],
    queryFn: async () => {
      if (!userID) {
        throw new Error('userID is required');
      }
      const response = await axios.get<IResponse<SocialLink[]>>(
        `${ApiPath.followers}`,
        { params: { userID } }
      );

      return response.data.content;
    },
    staleTime,
    gcTime,
    enabled: !!userID,
  });

  useEffect(() => {
    if (query.error) {
      onError?.(query.error);
    }
  }, [query.error, onError]);

  return { ...query };
};

export default useFollowers;
