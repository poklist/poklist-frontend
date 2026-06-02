import axios from '@/api/axios';
import { listsContract } from '@/api/contracts';
import { GetListsResponse } from '@/api/query/lists';
import ApiPath from '@/constants/apiPath';
import { Idea } from '@/constants/list';
import QueryKeys from '@/constants/queryKeys';
import { MessageType } from '@/enums/Style/index.enum';
import listsKeys from '@/hooks/api/lists/keys';
import { toast } from '@/hooks/useToast';
import { IResponse } from '@/types/response';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { DataResponse } from '@ts-rest/react-query';

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
    mutationFn: async ({ ideaOrder }: { ideaOrder: string[] }) => {
      const _params: { ideaOrder: string[] } = { ideaOrder: [] };
      ideaOrder.forEach((ideaID: string) => {
        _params.ideaOrder.push(ideaID);
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
        InfiniteData<DataResponse<typeof listsContract.getListsContract>>
      >(listsKeys.infiniteIdeas(listID));

      if (previousData) {
        const existingIdeas = previousData.pages.flatMap(
          (p) => p.body.content.ideas
        );
        const ideaIdMap = new Map(existingIdeas.map((idea) => [idea.id, idea]));

        const updatedIdeas = newOrder
          .map((id) => ideaIdMap.get(id))
          .filter(
            (idea): idea is GetListsResponse['content']['ideas'][number] =>
              !!idea
          );

        const updatedPages = previousData.pages.map((page, i) => ({
          ...page,
          body: {
            ...page.body,
            content: {
              ...page.body.content,
              ideas: updatedIdeas.slice(i * limit, (i + 1) * limit),
            },
          },
        }));

        queryClient.setQueryData(listsKeys.infiniteIdeas(listID), {
          pageParams: previousData.pageParams,
          pages: updatedPages,
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === QueryKeys.LIST &&
            query.queryKey[1] === listID,
          refetchType: 'inactive',
        }),
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.ORDER_IDEAS, listID],
        }),
        queryClient.invalidateQueries({
          queryKey: listsKeys.ideasOrder(listID),
        }),
      ]);

      onSuccess?.(serverData);
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
    reorderIdeas: mutation.mutate,
  };
};
