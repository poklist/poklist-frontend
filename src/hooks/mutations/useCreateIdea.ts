import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { CreateIdeaRequest, CreateIdeaResponse } from '@/types/Idea';
import { QUERY_KEYS } from '@/types/query';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateIdeaOptions {
  onSuccess?: (data: CreateIdeaResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateIdea = ({
  onSuccess,
  onError,
}: UseCreateIdeaOptions = {}) => {
  const queryClient = useQueryClient();
  const { setShowingAlert } = useCommonStore();

  const mutation = useMutation({
    mutationFn: async (ideaData: CreateIdeaRequest) => {
      const response = await axios.post<IResponse<CreateIdeaResponse>>(
        ApiPath.ideas,
        ideaData
      );
      return response.data.content;
    },
    onSuccess: async (data) => {
      // 使相關的查詢失效，強制重新獲取
      if (!data) {
        throw new Error('Failed to create idea');
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IDEA] });
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.LIST, data.listID.toString()],
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
      onError?.(error);
    },
  });

  return {
    ...mutation,
    createIdea: mutation.mutate,
    createIdeaAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
