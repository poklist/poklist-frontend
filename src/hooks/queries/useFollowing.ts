import ApiPath from '@/config/apiPath';
import QueryKeys from '@/config/queryKeys';
import axios from '@/lib/axios';
import { SocialLink } from '@/types/Relation';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseFollowingOptions {
  userID?: number;
  staleTime?: number;
  gcTime?: number;
  onError?: (error: Error) => void;
}

const useFollowing = ({
  userID,
  staleTime = 60000, // 1 min
  gcTime = 300000, // 5 mins
  onError,
}: UseFollowingOptions) => {
  const query = useQuery({
    queryKey: [QueryKeys.FOLLOWING, userID],
    queryFn: async () => {
      if (!userID) {
        throw new Error('userID is required');
      }
      const response = await axios.get<IResponse<SocialLink[]>>(
        `${ApiPath.following}`,
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

export default useFollowing;
