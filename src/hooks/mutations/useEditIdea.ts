import ApiPath from '@/constants/apiPath';
import { Idea } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { EditIdeaResponse, IdeaPreview } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const useEditIdea = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { setIsLoading } = useCommonStore();

  const mutation = useMutation({
    mutationFn: async (params: IdeaPreview) => {
      const response = await axios.put<IResponse<EditIdeaResponse>>(
        `${ApiPath.ideas}/${params.id}`,
        params
      );
      if (!response.data.content) {
        throw new Error('Failed to edit idea');
      }
      return response.data.content;
    },
    onMutate: () => {
      setIsEditing(true);
      setIsLoading(true);
    },
    onSuccess: async (data) => {
      const ideaQueryKey = [QueryKeys.IDEA, data.id.toString()];

      const listQueryKey = [
        QueryKeys.LIST,
        data.listID.toString(),
        Idea.DEFAULT_FIRST_BATCH_OFFSET,
        Idea.DEFAULT_BATCH_SIZE,
      ];
      // Invalidate for triggering refetch
      await queryClient.invalidateQueries({ queryKey: ideaQueryKey });
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.INFINITE_IDEA, data.listID.toString()],
        refetchType: 'inactive',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
    },
    onSettled: () => {
      setIsEditing(false);
      setIsLoading(false);
    },
  });

  return {
    editIdea: mutation.mutate,
    isEditIdeaLoading: mutation.isPending || isEditing,
    isEditIdeaError: mutation.isError,
    editIdeaError: mutation.error,
  };
};

export default useEditIdea;
