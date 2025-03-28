import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { DEFAULT_IDEA_BATCH_SIZE_MAX } from '@/constants/list';
import useGetList, { IListInfo } from '@/hooks/Lists/useGetList';
import axios from '@/lib/axios';
import { Tile20Background } from '@/pages/User/TileBackground';
import useCommonStore from '@/stores/useCommonStore';
import useRelationStore from '@/stores/useRelationStore';
import useSocialStore from '@/stores/useSocialStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListCard from './ListCard';

const ViewListPage: React.FC = () => {
  const { userCode: listOwnerUserCode, id: listID } = useParams();
  const { user: me } = useUserStore();
  const isMyPage = listOwnerUserCode === me.userCode;

  const { setIsLoading } = useCommonStore();

  const { isListInfoLoading, fetchGetListInfo } = useGetList();
  const [listInfo, setListInfo] = useState<IListInfo>();
  const [listOwnerInfo, setListOwnerInfo] = useState<User>();
  const { isLiked, originalIsLiked, initializeLikeStatus } = useSocialStore();
  const { isFollowing, originalIsFollowing, initializeFollowingStatus } =
    useRelationStore();

  const sendReactionForTheList = () => {
    if (isLiked === originalIsLiked) {
      return;
    }

    if (isLiked) {
      axios
        .post<IResponse<unknown>>('/like', null, {
          params: { listID: listID },
        })
        .catch(() => {
          console.error('Failed to like the list');
          // FUTURE: advanced error handling
        });
    } else {
      axios
        .post<IResponse<unknown>>('/unlike', null, {
          params: { listID: listID },
        })
        .catch(() => {
          console.error('Failed to unlike the list');
          // FUTURE: advanced error handling
        });
    }
  };

  const sendFollowingStatusForTheOwner = () => {
    if (isFollowing === originalIsFollowing) {
      return;
    }

    if (isFollowing) {
      axios
        .post<IResponse<unknown>>('/follow', null, {
          params: { userID: listInfo?.owner?.id },
        })
        .catch(() => {
          console.error('Failed to follow the user');
          // FUTURE: advanced error handling
        });
    } else {
      axios
        .post<IResponse<unknown>>('/unfollow', null, {
          params: { userID: listInfo?.owner?.id },
        })
        .catch(() => {
          console.error('Failed to unfollow the user');
          // FUTURE: advanced error handling
        });
    }
  };

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
      <div className="sm:min-h-desktop-container relative flex min-h-screen flex-col">
        <BackToUserHeader
          owner={listInfo?.owner}
          hasFollowButton={!isMyPage}
          onUnmount={sendFollowingStatusForTheOwner}
        />
        <div className="flex-1 px-3 pt-4">
          {listInfo && <ListCard data={listInfo} />}
        </div>
        <FloatingButtonFooter
          hasLikeButton={true}
          onUnmount={sendReactionForTheList}
        />
      </div>
    </>
  );
};

export default ViewListPage;
