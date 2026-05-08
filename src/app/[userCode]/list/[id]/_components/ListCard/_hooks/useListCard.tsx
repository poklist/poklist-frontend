import { GetListsResponse } from '@/api/query/lists';
import IdeaDrawerContent from '@/app/[userCode]/list/[id]/_components/IdeaDrawerContent';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { DrawerIds } from '@/constants/Drawer';
import { DAY_IN_MS, RECENTLY_UPDATED_DAYS } from '@/constants/list';
import { parsePostgresDate } from '@/lib/time';
import useLikeStore from '@/stores/useLikeStore';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const useListCard = (data: GetListsResponse['content']) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const listID = params?.id as string;

  const { getIsLiked } = useLikeStore();
  const { openDrawer } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);
  const deleteDrawer = useDrawer(DrawerIds.DELETE_LIST_DRAWER_ID);

  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [selectedIdeaID, setSelectedIdeaID] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState(data.likeCount);
  const [ideaCount, setIdeaCount] = useState(data.ideaTotalCount);

  const isLiked = listID ? getIsLiked(listID) : false;
  // Use useRef to track isLiked changes, preventing likeCount updates on first render
  const prevIsLikedRef = useRef(isLiked);

  useEffect(() => {
    setIdeaCount(data.ideaTotalCount);
  }, [data.ideaTotalCount]);

  // Sync likeCount from server data
  useEffect(() => {
    setLikeCount(data.likeCount);
  }, [data.likeCount]);

  // Listen to isLiked changes, only update likeCount when actual changes occur
  useEffect(() => {
    // Decrease likeCount when isLiked changes from true to false
    if (prevIsLikedRef.current === true && isLiked === false) {
      setLikeCount((prev) => prev - 1);
      // Increase likeCount when isLiked changes from false to true
    } else if (prevIsLikedRef.current === false && isLiked === true) {
      setLikeCount((prev) => prev + 1);
    }
    // Update prevIsLikedRef for next comparison
    prevIsLikedRef.current = isLiked;
  }, [isLiked]);

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

    setSelectedIdeaID(Number(ideaIDFromUrl));
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

  const onClickIdea = (ideaID: number) => setSelectedIdeaID(ideaID);

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
