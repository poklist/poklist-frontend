import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { Idea } from '@/constants/list';
import { useLikeAction } from '@/hooks/mutations/useLikeAction';
import { useList } from '@/hooks/queries/useList';
import { useUser } from '@/hooks/queries/useUser';
import { useToast } from '@/hooks/useToast';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { Tile20Background } from '@/pages/User/TileBackground';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useLikeStore from '@/stores/useLikeStore';
import useRelationStore from '@/stores/useRelationStore';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ListCard from './ListCard';

const ViewListPage: React.FC = () => {
  const { userCode: listOwnerUserCode } =
    useOutletContext<UserRouteLayoutContextType>();
  const { id: listID } = useParams();
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const isMyPage = listOwnerUserCode === me.userCode;

  const { setIsLoading } = useCommonStore();

  const { getIsLiked, setIsLiked, hasLikeState } = useLikeStore();
  const { setIsFollowing, hasFollowingState } = useRelationStore();
  const { toast } = useToast();

  // 獲取當前列表的點讚狀態
  const isLiked = listID ? getIsLiked(listID) : false;

  const { data: listOwner } = useUser({
    userCode: listOwnerUserCode,
  }) as { data: User | undefined };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: list, isLoading: isListLoading } = useList({
    listID: listID,
    offset: Idea.DEFAULT_FIRST_BATCH_OFFSET,
    limit: Idea.DEFAULT_BATCH_SIZE,
  });

  const { like, unlike } = useLikeAction({
    listID: listID || '',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const likeState = list.isLiked ?? false;
      const hasExistingLikeState = hasLikeState(listID);

      if (!hasExistingLikeState) {
        // 只有當 store 中沒有該列表的狀態時，才使用 API 資料初始化
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setIsLiked(listID, likeState);
      }
    }
  }, [list, listID, setIsLiked, hasLikeState]);

  useEffect(() => {
    if (listOwnerUserCode && listOwner) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const followingState = listOwner.isFollowing ?? false;
      const hasExistingState = hasFollowingState(listOwnerUserCode);

      if (!hasExistingState) {
        // 只有當 store 中沒有該用戶的狀態時，才使用 API 資料初始化
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setIsFollowing(listOwnerUserCode, followingState);
      }
    }
  }, [listOwner, listOwnerUserCode, setIsFollowing, hasFollowingState]);

  return (
    <>
      <Tile20Background />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
        <BackToUserHeader owner={list?.owner} hasFollowButton={!isMyPage} />
        <div className="mb-[55px] flex-1 px-3 pt-4">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
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
