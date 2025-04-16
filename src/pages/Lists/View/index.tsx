import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { Idea } from '@/constants/list';
import {
  SocialActionType,
  useSocialAction,
} from '@/hooks/mutations/useSocialAction';
import { useList } from '@/hooks/queries/useList';
import { useToast } from '@/hooks/useToast';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { Tile20Background } from '@/pages/User/TileBackground';
import useCommonStore from '@/stores/useCommonStore';
import useRelationStore from '@/stores/useRelationStore';
import useSocialStore from '@/stores/useSocialStore';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { t } from '@lingui/core/macro';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ListCard from './ListCard';

const ViewListPage: React.FC = () => {
  const { userCode: listOwnerUserCode } =
    useOutletContext<UserRouteLayoutContextType>();
  const { id: listID } = useParams();
  const { user: me, isLoggedIn } = useUserStore();
  const isMyPage = listOwnerUserCode === me.userCode;

  const { setIsLoading } = useCommonStore();

  const [listOwnerInfo, setListOwnerInfo] = useState<User>();
  const { setIsLiked } = useSocialStore();
  const { setIsFollowing } = useRelationStore();
  const { toast } = useToast();

  const { data: list, isLoading: isListLoading } = useList({
    listID: listID,
    offset: Idea.DEFAULT_FIRST_BATCH_OFFSET,
    limit: Idea.DEFAULT_BATCH_SIZE,
  });

  const { debouncedMutate: like } = useSocialAction({
    actionKey: 'like',
    debounceGroupKey: SocialActionType.LIKE,
    url: '/like',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsLiked(true);
    },
  });
  const { debouncedMutate: unlike } = useSocialAction({
    actionKey: 'unlike',
    debounceGroupKey: SocialActionType.LIKE,
    url: '/unlike',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsLiked(false);
    },
  });
  const { debouncedMutate: follow } = useSocialAction({
    actionKey: 'follow',
    debounceGroupKey: SocialActionType.FOLLOW,
    url: '/follow',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsFollowing(true);
    },
  });
  const { debouncedMutate: unfollow } = useSocialAction({
    actionKey: 'unfollow',
    debounceGroupKey: SocialActionType.FOLLOW,
    url: '/unfollow',
    shouldAllow: () => isLoggedIn,
    onNotAllowed: () => {
      toast({
        title: t`Please login to do this action`,
        variant: 'destructive',
      });
    },
    onOptimisticUpdate: () => {
      setIsFollowing(false);
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
    setIsLiked(list?.isLiked ?? false);
  }, [list?.isLiked]);

  useEffect(() => {
    setIsFollowing(listOwnerInfo?.isFollowing ?? false);
  }, [listOwnerInfo?.isFollowing]);

  return (
    <>
      <Tile20Background />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        <BackToUserHeader
          owner={list?.owner}
          hasFollowButton={!isMyPage}
          onClickFollow={() =>
            follow({ params: { userID: listOwnerInfo?.id } })
          }
          onClickUnfollow={() =>
            unfollow({ params: { userID: listOwnerInfo?.id } })
          }
        />
        <div className="mb-[55px] flex-1 px-3 pt-4">
          {list && <ListCard data={list} />}
        </div>
        <FloatingButtonFooter
          hasLikeButton={true}
          onClickLike={() => like({ params: { listID: listID } })}
          onClickUnlike={() => unlike({ params: { listID: listID } })}
        />
      </div>
    </>
  );
};

export default ViewListPage;
