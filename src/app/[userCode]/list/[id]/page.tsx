'use client';

import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { Idea } from '@/constants/list';
import { useLikeAction } from '@/hooks/mutations/useLikeAction';
import { useList } from '@/hooks/queries/useList';
import { useUser } from '@/hooks/queries/useUser';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useUserRouteContext } from '@/hooks/useUserRouteContext';
import { Tile20Background } from '@/app/user/_components/TileBackground';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useFollowingStore from '@/stores/useFollowingStore';
import useLikeStore from '@/stores/useLikeStore';
import useUserStore from '@/stores/useUserStore';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ListCard from './_components/ListCard';

const ViewListPage: React.FC = () => {
  const { userCode: listOwnerUserCode } = useUserRouteContext();
  const params = useParams();
  const listID = params?.id as string;

  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const isMyPage = listOwnerUserCode === me.userCode;
  const navigateTo = useStrictNavigationAdapter();
  const { setIsLoading } = useCommonStore();

  const { getIsLiked, setIsLiked, hasLikeState } = useLikeStore();
  const { setIsFollowing, hasFollowingState } = useFollowingStore();
  const { handleAuthRequired } = useAuthRequired();

  const isLiked = listID ? getIsLiked(listID) : false;

  const {
    data: listOwner,
    isLoading: isListOwnerLoading,
    isError: isListOwnerError,
  } = useUser({
    userCode: listOwnerUserCode,
  });

  const {
    data: list,
    isLoading: isListLoading,
    isError: isListError,
  } = useList({
    listID: listID,
    offset: Idea.DEFAULT_FIRST_BATCH_OFFSET,
    limit: Idea.DEFAULT_BATCH_SIZE,
  });

  useEffect(() => {
    if (isListOwnerError) {
      navigateTo.home();
    } else if (isListError) {
      navigateTo.user(listOwnerUserCode);
    }
  }, [isListOwnerError, isListError, listOwnerUserCode, navigateTo]);

  const { like, unlike } = useLikeAction({
    listID: listID || '',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: handleAuthRequired,
  });

  useEffect(() => {
    if (isListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListLoading, setIsLoading]);

  useEffect(() => {
    if (listID && list) {
      const likeState = list.isLiked ?? false;
      const hasExistingLikeState = hasLikeState(listID);

      if (!hasExistingLikeState) {
        setIsLiked(listID, likeState);
      }
    }
  }, [list, listID, setIsLiked, hasLikeState]);

  useEffect(() => {
    if (listOwnerUserCode && listOwner) {
      const followingState = listOwner.isFollowing ?? false;
      const hasExistingState = hasFollowingState(listOwnerUserCode);

      if (!hasExistingState) {
        setIsFollowing(listOwnerUserCode, followingState);
      }
    }
  }, [listOwner, listOwnerUserCode, setIsFollowing, hasFollowingState]);

  useEffect(() => {
    if (!isListOwnerLoading && !isListLoading && list?.owner && listID) {
      if (listOwnerUserCode !== list?.owner.userCode) {
        navigateTo.viewList(list?.owner.userCode, listID);
      }
    }
  }, [
    isListOwnerError,
    isListOwnerLoading,
    isListLoading,
    list?.owner,
    listID,
    listOwnerUserCode,
    navigateTo,
  ]);

  return (
    <>
      <Tile20Background />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        <BackToUserHeader owner={list?.owner} hasFollowButton={!isMyPage} />
        <div className="mb-[55px] flex-1 px-3 pt-4">
          {list && <ListCard data={list} />}
        </div>
        <FloatingButtonFooter
          hasLikeButton={true}
          isLiked={isLiked}
          onClickLike={() => like({ params: { listID: listID } })}
          onClickUnlike={() => unlike({ params: { listID: listID } })}
        />
      </div>
    </>
  );
};

export default ViewListPage;
