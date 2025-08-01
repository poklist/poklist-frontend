import ApiPath from '@/constants/apiPath';
import { Idea } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import axios from '@/lib/axios';
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
  limit?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useReorderIdeas = ({
  listID,
  limit = Idea.DEFAULT_BATCH_SIZE,
  onSuccess,
  onError,
}: UseReorderIdeasOptions) => {
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
      >([QueryKeys.INFINITE_IDEA, listID]);

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
        queryClient.setQueryData([QueryKeys.INFINITE_IDEA, listID], {
          pageParams: previousData.pageParams,
          pages: updatedPages,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.LIST,
          listID,
          Idea.DEFAULT_FIRST_BATCH_OFFSET,
          Idea.DEFAULT_BATCH_SIZE,
        ],
        refetchType: 'inactive',
      });

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ORDER_IDEAS, listID],
      });

      onSuccess?.(serverData);
    },
    onError: (error) => {
      toast({
        title: String(error),
        variant: MessageType.ERROR,
      });
      onError?.(error);
    },
  });

  return {
    isReorderIdeasLoading: mutation.isPending,
    reorderIdeas: mutation.mutate,
  };
};
