import { DrawerComponent, useDrawer } from '@/components/Drawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import ApiPath from '@/config/apiPath';
import {
  DESCRIPTION_PREVIEW_LENGTH,
  LINK_PREVIEW_LENGTH,
  RECENTLY_UPDATED_DAYS,
} from '@/constants/list';
import { Language, SocialLinkType } from '@/enums/index.enum';
import { IListInfo } from '@/hooks/Lists/useGetList';
import axios from '@/lib/axios';
import { getFormattedTime } from '@/lib/time';
import { getPreviewText, urlPreview } from '@/lib/utils';
import { CategoriesI18n } from '@/pages/Lists/i18n';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaDetail } from '@/types/Idea';
import { IResponse } from '@/types/response';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IdeaDrawerContent from '../IdeaDrawerContent';

interface IListCardProps {
  data: IListInfo;
}

const ListCard: React.FC<IListCardProps> = ({ data }) => {
  const { ideaID } = useParams();
  const { i18n } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, user } = useUserStore();

  const { openDrawer } = useDrawer();
  const { setShowingAlert } = useCommonStore();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [ideaMap, setIdeaMap] = useState<{
    [id: number]: IdeaDetail;
  }>();

  // FUTURE: move to custom hook?
  const [createdAtString, setCreatedAtString] = useState('');

  // NOTE: will this result in an error?
  const isUpdatedRecently =
    new Date().getTime() - new Date(data.updatedAt).getTime() <
    1000 * 60 * 60 * 24 * RECENTLY_UPDATED_DAYS;

  // FUTURE: refactor the drawer content because we may have more than one drawer
  const onClickDescription = () => {
    if (data.description.length <= DESCRIPTION_PREVIEW_LENGTH) {
      return;
    }
    setDrawerContent(<p>{data.description}</p>);
    openDrawer();
  };

  const onClickExternalLink = () => {
    if (urlPreview(data.externalLink).length <= LINK_PREVIEW_LENGTH) {
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
    if (ideaID) {
      navigate(`/${user.userCode}/list/${data.id}`, {
        state: { ideaID: Number(ideaID) },
      });
    }
  }, [ideaID, navigate, user.userCode, data.id]);

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
        <div className="flex flex-col items-center px-4">
          {isUpdatedRecently && (
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
                  navigate(`/${user.userCode}/list/${data.id}/edit`)
                }
              >
                <Trans>Edit list</Trans>
              </Button>
              <Button
                variant={ButtonVariant.HIGHLIGHTED}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_5PX}
                onClick={() =>
                  navigate(`/${user.userCode}/list/${data.id}/manage`)
                }
              >
                <Trans>Add an idea</Trans>
              </Button>
            </div>
          )}
          {data.description && (
            <div
              className="mt-6 text-[15px] -tracking-1.1%"
              onClick={onClickDescription}
            >
              {getPreviewText(data.description, DESCRIPTION_PREVIEW_LENGTH)}
            </div>
          )}
          {data.externalLink && (
            <div
              className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start px-2 text-[13px]"
              onClick={onClickExternalLink}
            >
              <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
              <p>
                {getPreviewText(
                  urlPreview(data.externalLink),
                  LINK_PREVIEW_LENGTH
                )}
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
                      <p className="text-[13px] text-black-text-01">
                        {getPreviewText(
                          idea.description,
                          DESCRIPTION_PREVIEW_LENGTH
                        )}
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
        isShowClose={false}
        content={drawerContent}
        className="px-6"
      />
    </>
  );
};

export default ListCard;
