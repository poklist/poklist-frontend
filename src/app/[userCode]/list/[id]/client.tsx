'use client';

import ListCard from '@/app/[userCode]/list/[id]/_components/ListCard';
import ListCardSkeleton from '@/app/[userCode]/list/[id]/_components/ListCard/ListCardSkeleton';
import { Tile20Background } from '@/app/user/_components/TileBackground';
import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { useGetListInfiniteIdeas } from '@/hooks/api/lists/useGetListInfiniteIdeas';
import { useGetUserInfo } from '@/hooks/api/users/useGetUserInfo';
import { useLikeAction } from '@/hooks/mutations/optimistic/likeUnlike/useLikeAction';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { notFound } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import useFollowingStore from '@/stores/useFollowingStore';
import useLikeStore from '@/stores/useLikeStore';
import useUserStore from '@/stores/useUserStore';
import { useEffect } from 'react';

interface ViewListPageClientProps {
  listID: string;
}

const ViewListPageClient: React.FC<ViewListPageClientProps> = ({
  listID,
}: ViewListPageClientProps) => {
  const { userCode: listOwnerUserCode } = useUserRouteContext();

  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const isMyPage = listOwnerUserCode === me.userCode;
  const navigateTo = useStrictNavigationAdapter();

  const { getIsLiked, setIsLiked, hasLikeState, setConfirmedIsLiked } =
    useLikeStore();
  const { setIsFollowing, hasFollowingState, setConfirmedIsFollowing } =
    useFollowingStore();
  const { handleAuthRequired } = useAuthRequired();

  const isLiked = listID ? getIsLiked(listID) : false;

  const { data: listOwner, isError: isListOwnerError } = useGetUserInfo({
    userCode: listOwnerUserCode,
  });

  const {
    data: list,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetListInfiniteIdeas({
    listID,
    limit: 0,
  });

  const listInfo = list?.pages[0]?.listInfo;
  const listOwnerOfData = listInfo?.owner;

  useEffect(() => {
    if (isListOwnerError) {
      navigateTo.home();
    }
  }, [isListOwnerError]);

  const { like, unlike } = useLikeAction({
    listID,
    shouldAllow: () => isLoggedIn,
    onNotAllowed: handleAuthRequired,
  });

  useEffect(() => {
    if (!listID || !listInfo) return;
    const likeState = listInfo.isLiked ?? false;
    if (!hasLikeState(listID)) setIsLiked(listID, likeState);
    setConfirmedIsLiked(listID, likeState);
  }, [listInfo, listID]);

  useEffect(() => {
    if (
      !(listOwnerUserCode && listOwner) ||
      !isLoggedIn ||
      listOwner.isFollowing === undefined
    ) {
      return;
    }
    const followingState = listOwner.isFollowing ?? false;
    const hasExistingState = hasFollowingState(listOwnerUserCode);

    if (!hasExistingState) {
      setIsFollowing(listOwnerUserCode, followingState);
    }
    setConfirmedIsFollowing(listOwnerUserCode, followingState);
  }, [
    listOwner,
    listOwnerUserCode,
    // setIsFollowing,
    // hasFollowingState,
    // setConfirmedIsFollowing,
  ]);

  useEffect(() => {
    if (
      listOwnerOfData &&
      listID &&
      listOwnerUserCode !== listOwnerOfData.userCode
    ) {
      navigateTo.viewList(listOwnerOfData.userCode, listID);
    }
  }, [listOwnerOfData, listID, listOwnerUserCode]);

  // 帶 token 的 client fetch 失敗 = 無權限（private list）或不存在 —
  // 兩者一律顯示 Not Found，不洩漏 list 存在性。
  // 必須放在所有 hooks 之後：條件 throw 在 hooks 之前會打破 hooks 順序
  if (isListError) {
    notFound();
  }

  return (
    <>
      <Tile20Background />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        <BackToUserHeader owner={listOwner} hasFollowButton={!isMyPage} />
        <div className="mb-[55px] flex-1 px-3 pt-4">
          {isListLoading ? (
            <ListCardSkeleton />
          ) : (
            list && listInfo && <ListCard data={listInfo} />
          )}
        </div>
        <FloatingButtonFooter
          hasLikeButton={true}
          isLiked={isLiked}
          hasCreateListButton={!isMyPage}
          onClickLike={() => like({ params: { listID } })}
          onClickUnlike={() => unlike({ params: { listID } })}
        />
      </div>
    </>
  );
};

export default ViewListPageClient;
