import ApiPath from '@/config/apiPath';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseReorderIdeasOptions {
  listID: string;
  offset?: number;
  limit?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useReorderIdeas = ({
  listID,
  offset = Idea.DEFAULT_FIRST_BATCH_OFFSET,
  limit = Idea.DEFAULT_BATCH_SIZE,
  onSuccess,
  onError,
}: UseReorderIdeasOptions) => {
  const { setShowingAlert } = useCommonStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ ideaOrder }: { ideaOrder: number[] }) => {
      const _params: { ideaOrder: number[] } = { ideaOrder: [] };
      ideaOrder.forEach((ideaID: number) => {
        _params.ideaOrder.push(Number(ideaID));
      });
      const response = await axios.post<IResponse<unknown>>(
        `${ApiPath.lists}/${listID}/reorder`,
        _params
      );
      return response.data.content;
    },
    onSuccess: async (data) => {
      // 使列表緩存失效，觸發重新獲取
      await queryClient.invalidateQueries({
        queryKey: ['list', listID, offset, limit],
      });
      await queryClient.invalidateQueries({
        queryKey: ['infiniteList', listID],
      });
      await queryClient.invalidateQueries({ queryKey: ['orderIdeas', listID] });
      onSuccess?.(data);
    },
    onError: (error) => {
      setShowingAlert(true, { message: String(error) });
      onError?.(error);
    },
  });

  return {
    isReorderIdeasLoading: mutation.isPending,
    reorderIdeas: mutation.mutate,
  };
};
