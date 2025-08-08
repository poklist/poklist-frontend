import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { DrawerIds } from '@/constants/Drawer';
import {
  DAY_IN_MS,
  DESCRIPTION_PREVIEW_LENGTH,
  RECENTLY_UPDATED_DAYS,
} from '@/constants/list';
import { Language, SocialLinkType } from '@/enums/index.enum';
import { useIdea } from '@/hooks/queries/useIdea';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { openWindow } from '@/lib/openLink';
import { getFormattedTime, parsePostgresDate } from '@/lib/time';
import { urlPreview } from '@/lib/utils';

import DropdownMenuComponent, {
  DropdownItem,
} from '@/app/[userCode]/list/[id]/_components/DropdownMenu';
import IdeaDrawerContent from '@/app/[userCode]/list/[id]/_components/IdeaDrawerContent';
import IconAddCircle from '@/components/ui/icons/AddCircleIcon';
import IconEdit from '@/components/ui/icons/EditIcon';
import IconSort from '@/components/ui/icons/SortIcon';
import IconThreeDots from '@/components/ui/icons/ThreeDots';
import TrashIcon from '@/components/ui/icons/TrashIcon';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { DropdownItemType, MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import useAuthStore from '@/stores/useAuthStore';
import useLikeStore from '@/stores/useLikeStore';
import useUserStore from '@/stores/useUserStore';
import { List } from '@/types/List';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface ViewListNavigateState {
  ideaID?: number;
}

interface IListCardProps {
  data: List;
}

const ListCard: React.FC<IListCardProps> = ({ data }: IListCardProps) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const listID = params?.id as string;

  const { i18n } = useLingui();
  const navigateTo = useStrictNavigationAdapter();

  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { getIsLiked } = useLikeStore();
  const { openDrawer } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [selectedIdeaID, setSelectedIdeaID] = useState<number | null>(null);
  // FUTURE: move to custom hook?
  const [createdAtString, setCreatedAtString] = useState('');
  // Use useState to manage like count, initial value from data.likeCount
  const [likeCount, setLikeCount] = useState(data.likeCount);
  const externalLinkRef = useRef<HTMLDivElement>(null);

  // Get current like status for this list
  const isLiked = listID ? getIsLiked(listID) : false;
  // Use useRef to track isLiked changes, preventing likeCount updates on first render
  const prevIsLikedRef = useRef(isLiked);

  // Update likeCount when data.likeCount changes (from API refetch)
  useEffect(() => {
    setLikeCount(data.likeCount);
  }, [data.likeCount]);

  // Listen to isLiked changes, only update likeCount when actual changes occur
  useEffect(() => {
    // Decrease likeCount when isLiked changes from true to false
    if (prevIsLikedRef.current === true && isLiked === false) {
      setLikeCount((prev) => prev - 1);
    }
    // Increase likeCount when isLiked changes from false to true
    else if (prevIsLikedRef.current === false && isLiked === true) {
      setLikeCount((prev) => prev + 1);
    }
    // Update prevIsLikedRef for next comparison
    prevIsLikedRef.current = isLiked;
  }, [isLiked]);

  const { idea, isError } = useIdea({
    ideaID: selectedIdeaID?.toString(),
    enabled: !!selectedIdeaID,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Failed to fetch idea detail',
        variant: MessageType.ERROR,
      });
      setSelectedIdeaID(null);
    }
  }, [isError]);

  useEffect(() => {
    if (idea && selectedIdeaID) {
      setDrawerContent(<IdeaDrawerContent data={idea} />);
      openDrawer();
      setSelectedIdeaID(null);
    }
  }, [idea, selectedIdeaID, openDrawer]);

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
    if (
      data.description === undefined ||
      data.description.length <= DESCRIPTION_PREVIEW_LENGTH
    ) {
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
      openWindow(data.externalLink);
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

  const onClickIdea = (ideaID: number) => {
    setSelectedIdeaID(ideaID);
  };

  useEffect(() => {
    const locale =
      i18n.locale === (Language.ZH_TW as string) ? Language.ZH_TW : Language.EN; // FUTURE: be aware of the future i18n support
    setCreatedAtString(getFormattedTime(data.createdAt, locale));
  }, [data.createdAt, i18n.locale]);

  // 替換 location.state 的處理方式，使用 searchParams
  useEffect(() => {
    const ideaIDFromUrl = searchParams?.get('ideaID');
    if (ideaIDFromUrl) {
      onClickIdea(Number(ideaIDFromUrl));
      // 清除 URL 中的 ideaID 參數
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('ideaID');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const items: DropdownItem[] = [
    {
      type: DropdownItemType.ITEM,
      label: t`Edit List Info`,
      onClick: () => navigateTo.manageList(me.userCode, data.id.toString()),
      icon: <IconEdit />,
    },
    {
      type: DropdownItemType.ITEM,
      label: t`Add Idea`,
      onClick: () => {
        const params = new URLSearchParams();
        params.set('listID', data.id.toString());
        params.set('listTitle', data.title);
        navigateTo.createIdea(`/idea/create?${params.toString()}`);
      },
      icon: <IconAddCircle />,
    },
    {
      type: DropdownItemType.ITEM,
      label: t`Reorder Idea`,
      onClick: () => console.warn('Sort'),
      icon: <IconSort />,
    },
    { type: DropdownItemType.SEPARATOR },
    {
      type: DropdownItemType.ITEM,
      label: t`Delete List`,
      onClick: () => console.warn('Delete List'),
      icon: <TrashIcon />,
      danger: true,
    },
  ];
  return (
    <>
      <div className="relative flex flex-col items-center rounded-[32px] border border-black bg-white py-6">
        {isLoggedIn && me?.id === data.owner.id && (
          <DropdownMenuComponent
            trigger={
              <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center">
                <IconThreeDots />
              </div>
            }
            items={items}
          />
        )}
        <div className="flex w-full flex-col items-center px-4">
          {isUpdatedRecently() && (
            <div className="-tracking-0.8% mb-2 flex h-[27px] items-center justify-center rounded-full bg-yellow-bright-01 px-4 text-[13px] font-semibold">
              <Trans>Recently Updated</Trans>
            </div>
          )}
          <div className="tracking-0.8% text-[13px]">
            <Trans>Listing since</Trans> {createdAtString}
          </div>
          <div className="-tracking-2% mt-4 text-center text-[26px] font-extrabold">
            {data.title}
          </div>
          <div className="tracking-0.8% mt-4 flex gap-2 text-[13px]">
            <p>{i18n._(CategoriesI18n[data.categoryID])}</p>
            <p>•</p>
            <p>
              {likeCount} <Trans>Likes</Trans>
            </p>
          </div>
          {isLoggedIn && me?.id === data.owner.id && (
            <div className="mt-6 flex w-full gap-2">
              <Button
                variant={ButtonVariant.BLACK}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_5PX}
                onClick={() =>
                  navigateTo.manageList(me.userCode, data.id.toString())
                }
              >
                <Trans>Edit list</Trans>
              </Button>
              <Button
                variant={ButtonVariant.HIGHLIGHTED}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_5PX}
                onClick={() => {
                  // 使用 URL parameters 代替 state 來傳遞數據
                  const params = new URLSearchParams();
                  params.set('listID', data.id.toString());
                  params.set('listTitle', data.title);
                  navigateTo.createIdea(`/idea/create?${params.toString()}`);
                }}
              >
                <Trans>Add an idea</Trans>
              </Button>
            </div>
          )}
          {data.description && (
            <div
              className="mt-6 line-clamp-1 w-full text-[15px] -tracking-1.1%"
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
            <Image
              src={data.coverImage || ''}
              alt={data.title}
              width={374}
              height={374}
              className="mt-4 rounded-xl border border-black"
            />
          )}
        </div>
        {data.ideas.length > 0 ? (
          <div className="mt-4 flex w-full flex-col">
            {data.ideas.map((idea) => {
              return (
                <div
                  key={idea.title}
                  className="flex min-h-[65px] items-center justify-between gap-2 border-t border-gray-main-03 p-4 -tracking-1.1%"
                  onClick={() => onClickIdea(idea.id)}
                >
                  <div className="flex w-full flex-col gap-2">
                    <p className="text-[15px] font-semibold text-black-text-01">
                      {idea.title}
                    </p>
                    {idea.description && (
                      <p className="line-clamp-1 max-w-[80%] text-[13px] text-gray-storm-01">
                        {idea.description}
                      </p>
                    )}
                  </div>
                  {idea.coverImage && (
                    <Image
                      src={idea.coverImage || ''}
                      alt={idea.title}
                      width={64}
                      height={64}
                      className="rounded-lg border border-black-text-01"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // 無靈感文字/NoDataComponent？
          <></>
        )}
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
