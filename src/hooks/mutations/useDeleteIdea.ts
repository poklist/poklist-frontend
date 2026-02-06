import ApiPath from '@/constants/apiPath';
import { Idea } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface UseDeleteIdeaOptions {
  listID: string;
}

const useDeleteIdea = ({ listID }: UseDeleteIdeaOptions) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setIsLoading } = useCommonStore();

  const mutation = useMutation({
    mutationFn: async (ideaID: number) => {
      const response = await axios.delete<IResponse<unknown>>(
        `${ApiPath.ideas}/${ideaID}`
      );
      if (response.data.code != 200) {
        throw new Error('Failed to delete idea');
      }
      return;
    },
    onMutate: () => {
      setIsDeleting(true);
      setIsLoading(true);
    },
    onSuccess: async (_, ideaID) => {
      // Remove the deleted idea's cache
      queryClient.removeQueries({
        queryKey: [QueryKeys.IDEA, ideaID.toString()],
      });
      // Invalidate and refetch the list
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            QueryKeys.LIST,
            listID,
            Idea.DEFAULT_FIRST_BATCH_OFFSET,
            Idea.DEFAULT_BATCH_SIZE,
          ],
        }),
        queryClient.refetchQueries({
          queryKey: [QueryKeys.INFINITE_IDEA, listID],
        })
      ])
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: MessageType.ERROR,
      });
    },
    onSettled: () => {
      setIsDeleting(false);
      setIsLoading(false);
    },
  });

  return {
    deleteIdea: mutation.mutate,
    isDeleteIdeaLoading: mutation.isPending || isDeleting,
    isDeleteIdeaError: mutation.isError,
    deleteIdeaError: mutation.error,
  };
};

export default useDeleteIdea;
