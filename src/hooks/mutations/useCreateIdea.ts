import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import { CreateIdeaRequest, CreateIdeaResponse } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import listsKeys from '@/hooks/api/lists/keys';

interface UseCreateIdeaOptions {
  onSuccess?: (data: CreateIdeaResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateIdea = ({
  onSuccess,
  onError,
}: UseCreateIdeaOptions = {}) => {
  const queryClient = useQueryClient();

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
      try {
        await Promise.all([
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey[0] === QueryKeys.LIST &&
              query.queryKey[1] === data.listID.toString(),
            refetchType: 'inactive',
          }),
          queryClient.invalidateQueries({
            queryKey: listsKeys.infiniteIdeas(data.listID.toString()),
            refetchType: 'inactive',
          }),
          queryClient.refetchQueries({
            queryKey: [QueryKeys.INFINITE_IDEA, data.listID.toString()],
          }),
          queryClient.refetchQueries({
            queryKey: listsKeys.infiniteIdeas(data.listID.toString()),
          }),
        ]);
      } catch (error) {
        console.warn('Refetch failed, but idea was created: ', error);
      }
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
      onError?.(error);
    },
  });

  return {
    ...mutation,
    createIdea: mutation.mutate,
    createIdeaAsync: mutation.mutateAsync,
  };
};
