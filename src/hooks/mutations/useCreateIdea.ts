import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { CreateIdeaRequest, CreateIdeaResponse } from '@/types/Idea';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateIdeaOptions {
  onSuccess?: (data: CreateIdeaResponse) => void;
  onError?: (error: any) => void;
}

export const useCreateIdea = ({
  onSuccess,
  onError,
}: UseCreateIdeaOptions = {}) => {
  const queryClient = useQueryClient();
  const { setShowingAlert } = useCommonStore();

  const mutation = useMutation({
    mutationKey: ['ideas'],
    mutationFn: async (ideaData: CreateIdeaRequest) => {
      const response = await axios.post<{ content: CreateIdeaResponse }>(
        ApiPath.ideas,
        ideaData
      );
      return response.data.content;
    },
    onSuccess: (data) => {
      // 使相關的查詢失效，強制重新獲取
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['list', data.listID] });
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
