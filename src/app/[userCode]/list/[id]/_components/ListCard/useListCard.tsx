import { GetListsResponse } from '@/api/query/lists';
import IdeaDrawerContent from '@/app/[userCode]/list/[id]/_components/IdeaDrawerContent';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { DrawerIds } from '@/constants/Drawer';
import { DAY_IN_MS, RECENTLY_UPDATED_DAYS } from '@/constants/list';
import { parsePostgresDate } from '@/lib/time';
import useLikeStore from '@/stores/useLikeStore';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const useListCard = (data: GetListsResponse['content']) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const listID = params?.id as string;

  const { getIsLiked } = useLikeStore();
  const { openDrawer } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);
  const deleteDrawer = useDrawer(DrawerIds.DELETE_LIST_DRAWER_ID);

  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [selectedIdeaID, setSelectedIdeaID] = useState<string | null>(null);

  const isLiked = listID ? getIsLiked(listID) : false;
  const ideaCount = data.ideaTotalCount;

  // likeCount 為衍生值，不用 state 累加。
  // 累加寫法（偵測 isLiked 的 false→true 轉換再 +1）分不清兩種來源：
  //   1. 用戶點讚 → server count 尚未含這一讚，需 +1
  //   2. seed 伺服器真相（§13.1 的帶 token refetch）→ server count 早已含，不可 +1
  // 冷啟動 + 已讚過的用戶會命中第 2 種而多算一個。
  // 改為「以 server 的 (isLiked, likeCount) 為基準，只補上 optimistic 與它的差值」，
  // 天然冪等，不受 effect 執行順序影響。
  const likeCount = useMemo(() => {
    const serverLikeCount = data.likeCount;
    // 型別謊言（§13）：schema 宣告 boolean，但 hydration strip 後 runtime 可能是 undefined
    const serverIsLiked: boolean | undefined = data.isLiked;

    // server 尚未表態（匿名 hydration / 帶 token refetch 未回）→ 直接信 server 數字
    if (serverIsLiked === undefined) return serverLikeCount;
    if (isLiked === serverIsLiked) return serverLikeCount;
    return isLiked ? serverLikeCount + 1 : serverLikeCount - 1;
  }, [isLiked, data.isLiked, data.likeCount]);

  useEffect(() => {
    if (selectedIdeaID) {
      setDrawerContent(
        <IdeaDrawerContent ideaID={selectedIdeaID.toString()} />
      );
      openDrawer();
      setSelectedIdeaID(null);
    }
  }, [selectedIdeaID, openDrawer]);

  // Handle ideaID from URL params (replaces location.state)
  useEffect(() => {
    const ideaIDFromUrl = searchParams?.get('ideaID');
    if (!ideaIDFromUrl) return;

    setSelectedIdeaID(ideaIDFromUrl);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('ideaID');
    window.history.replaceState({}, '', newUrl.toString());
  }, [searchParams]);

  const isUpdatedRecently = (): boolean => {
    try {
      const updatedDate = parsePostgresDate(data.updatedAt);
      if (!updatedDate) return false;
      return (
        Date.now() - updatedDate.getTime() < DAY_IN_MS * RECENTLY_UPDATED_DAYS
      );
    } catch {
      return false;
    }
  };

  const onClickIdea = (ideaID: string) => setSelectedIdeaID(ideaID);

  return {
    ideaCount,
    likeCount,
    drawerContent,
    setDrawerContent,
    openDrawer,
    openDeleteDrawer: deleteDrawer.openDrawer,
    closeDeleteDrawer: deleteDrawer.closeDrawer,
    isUpdatedRecently,
    onClickIdea,
  };
};

export default useListCard;
