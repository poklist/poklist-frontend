import ApiPath from '@/config/apiPath';
import { Idea } from '@/constants/list';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IdeaPreview } from '@/types/Idea';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

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
      return {
        serverData: response.data.content,
        newOrder: ideaOrder,
      };
    },
    onSuccess: async ({ serverData, newOrder }) => {
      const previousData = queryClient.getQueryData<
        InfiniteData<{
          listInfo: List;
          ideas: IdeaPreview[];
          nextOffset: number;
          total: number;
        }>
      >(['infiniteList', listID]);

      if (previousData) {
        const existingIdeas = previousData.pages.flatMap((p) => p.ideas);
        const ideaIdMap = new Map(existingIdeas.map((idea) => [idea.id, idea]));

        const updatedIdeas = newOrder
          .map((id) => ideaIdMap.get(id))
          .filter((idea): idea is IdeaPreview => !!idea);

        const updatedPages = [];
        for (let i = 0; i < updatedIdeas.length; i += limit) {
          const pageIdeas = updatedIdeas.slice(i, i + limit);
          updatedPages.push({
            listInfo: previousData.pages[0].listInfo,
            ideas: pageIdeas,
            nextOffset: i + pageIdeas.length, // 正確設定 nextOffset
            total: previousData.pages[0].total,
          });
        }
        queryClient.setQueryData(['infiniteList', listID], {
          pageParams: previousData.pageParams,
          pages: updatedPages,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['list', listID, offset, limit],
      });

      await queryClient.invalidateQueries({ queryKey: ['orderIdeas', listID] });

      onSuccess?.(serverData);
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
