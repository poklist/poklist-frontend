import axios from '@/api/axios';
import ApiPath from '@/constants/apiPath';
import { Idea } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import useCommonStore from '@/stores/useCommonStore';
import { CreateIdeaRequest, CreateIdeaResponse } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface UseCreateIdeaOptions {
  onSuccess?: (data: CreateIdeaResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateIdea = ({
  onSuccess,
  onError,
}: UseCreateIdeaOptions = {}) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const { setIsLoading } = useCommonStore();

  const mutation = useMutation({
    mutationFn: async (ideaData: CreateIdeaRequest) => {
      const response = await axios.post<IResponse<CreateIdeaResponse>>(
        ApiPath.ideas,
        ideaData
      );
      return response.data.content;
    },
    onMutate: () => {
      setIsCreating(true);
      setIsLoading(true);
    },
    onSuccess: async (data) => {
      // 使相關的查詢失效，強制重新獲取
      if (!data) {
        throw new Error('Failed to create idea');
      }
      try {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeys.LIST,
              data.listID.toString(),
              Idea.DEFAULT_FIRST_BATCH_OFFSET,
              Idea.DEFAULT_BATCH_SIZE,
            ],
            refetchType: 'inactive',
          }),
          queryClient.refetchQueries({
            queryKey: [QueryKeys.INFINITE_IDEA, data.listID.toString()],
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
    onSettled: () => {
      setIsCreating(false);
      setIsLoading(false);
    },
  });

  return {
    ...mutation,
    createIdea: mutation.mutate,
    createIdeaAsync: mutation.mutateAsync,
    isLoading: mutation.isPending || isCreating,
  };
};
