import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { DEFAULT_IDEA_BATCH_SIZE_MAX } from '@/constants/list';
import useGetList, { IListInfo } from '@/hooks/Lists/useGetList';
import { SocialActionType, useSocialAction } from '@/hooks/useSocialAction';
import { useToast } from '@/hooks/useToast';
import axios from '@/lib/axios';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { Tile20Background } from '@/pages/User/TileBackground';
import useCommonStore from '@/stores/useCommonStore';
import useRelationStore from '@/stores/useRelationStore';
import useSocialStore from '@/stores/useSocialStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
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

  const { isListInfoLoading, fetchGetListInfo } = useGetList();
  const [listInfo, setListInfo] = useState<IListInfo>();
  const [listOwnerInfo, setListOwnerInfo] = useState<User>();
  const { setIsLiked, initializeLikeStatus } = useSocialStore();
  const {
    isFollowing,
    setIsFollowing,
    originalIsFollowing,
    initializeFollowingStatus,
  } = useRelationStore();
  const { toast } = useToast();

  const { debouncedMutate: like } = useSocialAction({
    actionKey: 'like',
    debounceGroupKey: SocialActionType.LIKE,
    url: '/like',
    method: 'POST',
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
    method: 'POST',
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
    method: 'POST',
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
    method: 'POST',
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
    if (listID) {
      const _fetchGetListInfo = async () => {
        const response = await fetchGetListInfo(
          listID,
          0,
          DEFAULT_IDEA_BATCH_SIZE_MAX
        );
        if (response) {
          setListInfo(response);
        }
      };
      _fetchGetListInfo();
    }
  }, [listID]);

  // FUTURE: refactor the code into custom hook
  useEffect(() => {
    if (listOwnerUserCode) {
      const _fetchGetUserInfo = async () => {
        const res = await axios.get<IResponse<User>>(
          `/${listOwnerUserCode}/info`
        );
        if (res.data.content) {
          setListOwnerInfo(res.data.content);
        }
      };
      _fetchGetUserInfo();
    }
  }, [listOwnerUserCode]);

  useEffect(() => {
    if (isListInfoLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isListInfoLoading, setIsLoading]);

  useEffect(() => {
    initializeLikeStatus(listInfo?.isLiked ?? false);
  }, [listInfo?.isLiked]);

  useEffect(() => {
    initializeFollowingStatus(listOwnerInfo?.isFollowing ?? false);
  }, [listOwnerInfo?.isFollowing]);

  return (
    <>
      <Tile20Background />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        <BackToUserHeader
          owner={listInfo?.owner}
          hasFollowButton={!isMyPage}
          onClickFollow={() =>
            follow({ params: { userID: listOwnerInfo?.id } })
          }
          onClickUnfollow={() =>
            unfollow({ params: { userID: listOwnerInfo?.id } })
          }
        />
        <div className="mb-[55px] flex-1 px-3 pt-4">
          {listInfo && <ListCard data={listInfo} />}
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
