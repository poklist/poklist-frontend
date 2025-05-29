import ApiPath from '@/config/apiPath';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseDeleteIdeaOptions {
  listID: string;
}

const useDeleteIdea = ({ listID }: UseDeleteIdeaOptions) => {
  const { setShowingAlert } = useCommonStore();
  const queryClient = useQueryClient();

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
    onSuccess: async (_, ideaID) => {
      // Remove the deleted idea's cache
      queryClient.removeQueries({ queryKey: ['idea', ideaID.toString()] });

      // Invalidate and refetch the list
      await queryClient.invalidateQueries({
        queryKey: [
          'list',
          listID,
          Idea.DEFAULT_FIRST_BATCH_OFFSET,
          Idea.DEFAULT_BATCH_SIZE,
        ],
      });
      await queryClient.refetchQueries({
        queryKey: ['infiniteList', listID],
      });
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
    },
  });

  return {
    deleteIdea: mutation.mutate,
    isDeleteIdeaLoading: mutation.isPending,
    isDeleteIdeaError: mutation.isError,
    deleteIdeaError: mutation.error,
  };
};

export default useDeleteIdea;
