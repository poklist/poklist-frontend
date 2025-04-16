import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseReorderIdeasOptions {
  listID: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: any) => void;
}

export const useReorderIdeas = ({
  listID,
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
    onSuccess: (data) => {
      // 使列表緩存失效，觸發重新獲取
      queryClient.invalidateQueries({ queryKey: ['list', listID] });
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
