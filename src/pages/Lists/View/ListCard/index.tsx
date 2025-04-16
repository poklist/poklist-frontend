import { DrawerComponent, useDrawer } from '@/components/Drawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import ApiPath from '@/config/apiPath';
import { DrawerIds } from '@/constants/Drawer';
import {
  DAY_IN_MS,
  DESCRIPTION_PREVIEW_LENGTH,
  RECENTLY_UPDATED_DAYS,
} from '@/constants/list';
import { Language, SocialLinkType } from '@/enums/index.enum';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import axios from '@/lib/axios';
import { getFormattedTime, parsePostgresDate } from '@/lib/time';
import { urlPreview } from '@/lib/utils';
import { UserRouteLayoutContextType } from '@/pages/Layout/UserRouteLayuout';
import { CategoriesI18n } from '@/pages/Lists/i18n';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaDetail } from '@/types/Idea';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import IdeaDrawerContent from '../IdeaDrawerContent';

interface IListCardProps {
  data: List;
}

const ListCard: React.FC<IListCardProps> = ({ data }) => {
  const { userCode: listOwnerUserCode } =
    useOutletContext<UserRouteLayoutContextType>();
  const { id: listID, ideaID } = useParams();

  const { i18n } = useLingui();
  const navigateTo = useStrictNavigate();
  const location = useLocation();

  const { isLoggedIn, user } = useUserStore();

  const { openDrawer } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);
  const { setShowingAlert } = useCommonStore();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [ideaMap, setIdeaMap] = useState<{
    [id: number]: IdeaDetail;
  }>();
  // FUTURE: move to custom hook?
  const [createdAtString, setCreatedAtString] = useState('');
  const externalLinkRef = useRef<HTMLDivElement>(null);

  const isUpdatedRecently = () => {
    try {
      const currentTime = new Date().getTime();
      const updatedDate = parsePostgresDate(data.updatedAt);

      if (!updatedDate) {
        console.error('Invalid date:', data.updatedAt);
        return false;
      }

      return (
        currentTime - updatedDate.getTime() < DAY_IN_MS * RECENTLY_UPDATED_DAYS
      );
    } catch (error) {
      console.error('Error checking update time:', error);
      return false;
    }
  };

  // FUTURE: refactor the drawer content because we may have more than one drawer
  const onClickDescription = () => {
    if (data.description.length <= DESCRIPTION_PREVIEW_LENGTH) {
      return;
    }
    setDrawerContent(<p>{data.description}</p>);
    openDrawer();
  };

  const onClickExternalLink = () => {
    if (
      externalLinkRef.current?.scrollHeight === undefined ||
      externalLinkRef.current?.clientHeight === undefined ||
      externalLinkRef.current.scrollHeight <=
        externalLinkRef.current.clientHeight
    ) {
      window.open(data.externalLink, '_blank');
      return;
    }

    setDrawerContent(
      <div className="flex h-8 cursor-pointer items-start gap-2 break-all px-2 text-[13px]">
        <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
        <a
          className="text-black-text-01"
          href={data.externalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.externalLink}
        </a>
      </div>
    );
    openDrawer();
  };

  const onClickIdea = async (ideaID: number) => {
    let ideaDetail: IdeaDetail | undefined;
    if (ideaMap?.[ideaID] === undefined) {
      const response: AxiosResponse<IResponse<IdeaDetail>> = await axios.get(
        `${ApiPath.ideas}/${ideaID}`
      );
      ideaDetail = response.data.content;
    } else {
      ideaDetail = ideaMap[ideaID];
    }

    if (ideaDetail) {
      setIdeaMap((prev) => ({ ...prev, [ideaID]: ideaDetail }));
      setDrawerContent(<IdeaDrawerContent data={ideaDetail} />);
      openDrawer();
    } else {
      setShowingAlert(true, { message: 'Failed to fetch idea detail' });
    }
  };

  useEffect(() => {
    const locale =
      i18n.locale === Language.ZH_TW ? Language.ZH_TW : Language.EN; // FUTURE: be aware of the future i18n support
    setCreatedAtString(getFormattedTime(data.createdAt, locale));
  }, [data.createdAt, i18n.locale]);

  useEffect(() => {
    if (listID && ideaID) {
      navigateTo.viewList(listOwnerUserCode, listID, ideaID);
    }
  }, [ideaID, listID, navigateTo, user.userCode]);

  useEffect(() => {
    if (location.state?.ideaID) {
      const _onClickIdea = async () => {
        await onClickIdea(location.state.ideaID);
      };
      _onClickIdea();
      location.state.ideaID = undefined;
    }
  }, [location.state?.ideaID, onClickIdea]);

  return (
    <>
      <div className="flex flex-col items-center rounded-[32px] border border-black bg-white py-6">
        <div className="flex w-full flex-col items-center px-4">
          {isUpdatedRecently() && (
            <div className="-tracking-0.8% mb-2 flex h-[27px] items-center justify-center rounded-full bg-yellow-bright-01 px-4 text-[13px] font-semibold">
              <Trans>Recently Updated</Trans>
            </div>
          )}
          <div className="tracking-0.8% text-[13px]">
            <Trans>Listing since</Trans> {createdAtString}
          </div>
          <div className="-tracking-2% mt-4 text-[26px] font-extrabold">
            {data.title}
          </div>
          <div className="tracking-0.8% mt-4 flex gap-2 text-[13px]">
            <p>{i18n._(CategoriesI18n[data.categoryID])}</p>
            <p>•</p>
            <p>
              {data.likeCount} <Trans>Likes</Trans>
            </p>
          </div>
          {isLoggedIn && user?.id === data.owner.id && (
            <div className="mt-6 flex w-full gap-2">
              <Button
                variant={ButtonVariant.BLACK}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_5PX}
                onClick={() =>
                  navigateTo.manageList(user.userCode, data.id.toString())
                }
              >
                <Trans>Edit list</Trans>
              </Button>
              <Button
                variant={ButtonVariant.HIGHLIGHTED}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_5PX}
                onClick={() =>
                  navigateTo.createIdea({
                    state: { listID: Number(data.id), listTitle: data.title },
                  })
                }
              >
                <Trans>Add an idea</Trans>
              </Button>
            </div>
          )}
          {data.description && (
            <div
              className="mt-6 line-clamp-1 text-[15px] -tracking-1.1%"
              onClick={onClickDescription}
            >
              {data.description}
            </div>
          )}
          {data.externalLink && (
            <div
              className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start text-[13px]"
              onClick={onClickExternalLink}
            >
              <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
              <p ref={externalLinkRef} className="line-clamp-1">
                {urlPreview(data.externalLink)}
              </p>
            </div>
          )}
          {data.coverImage && (
            <img
              src={data.coverImage}
              alt={data.title}
              width={374}
              height={374}
              className="mt-4 rounded-[12px] border border-black"
            />
          )}
        </div>
        {data.ideas.length > 0 && (
          <div className="mt-4 flex w-full flex-col gap-2">
            {data.ideas.map((idea) => {
              return (
                <div
                  key={idea.title}
                  className="flex min-h-[65px] items-center justify-between border-t-[1px] border-gray-main-03 p-4 -tracking-1.1%"
                  onClick={() => onClickIdea(idea.id)}
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-semibold text-black-text-01">
                      {idea.title}
                    </p>
                    {idea.description && (
                      <p className="line-clamp-1 max-w-[64%] text-[13px] text-gray-storm-01">
                        {idea.description}
                      </p>
                    )}
                  </div>
                  {idea.coverImage && (
                    <img
                      src={idea.coverImage}
                      width={64}
                      height={64}
                      className="rounded-[8px] border border-black-text-01"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* TODO: See more button */}
      </div>
      <DrawerComponent
        drawerId={DrawerIds.LIST_CARD_DRAWER_ID}
        isShowClose={false}
        content={drawerContent}
        className="px-6"
      />
    </>
  );
};

export default ListCard;
