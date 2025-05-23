import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { IdeaResponse } from '@/types/Idea';
import { QUERY_KEYS } from '@/types/query';
import { IResponse } from '@/types/response';
import { useQuery } from '@tanstack/react-query';

interface UseIdeaOptions {
  ideaID?: string;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}

export const useIdea = ({
  ideaID,
  staleTime = 1000 * 60, // 1 minute
  gcTime = 1000 * 60 * 5, // 5 minutes
  enabled = true,
}: UseIdeaOptions) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.IDEA, ideaID],
    queryFn: async () => {
      if (!ideaID) {
        throw new Error('ideaID is required');
      }
      const response = await axios.get<IResponse<IdeaResponse>>(
        `${ApiPath.ideas}/${ideaID}`
      );
      return response.data.content;
    },
    staleTime,
    gcTime,
    enabled: enabled && !!ideaID,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: undefined,
    refetchInterval: false,
  });

  return {
    ...query,
    idea: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
};
