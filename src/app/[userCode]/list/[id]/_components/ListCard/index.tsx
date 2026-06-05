import { GetListsResponse } from '@/api/query/lists';
import DropdownMenuComponent, {
  DropdownItem,
} from '@/app/[userCode]/list/[id]/_components/DropdownMenu';
import { AddIdeaRow } from '@/app/[userCode]/list/[id]/_components/ListCard/_components/AddIdeaRow';
import { IdeaList } from '@/app/[userCode]/list/[id]/_components/ListCard/_components/IdeaList';
import { ListCardDescription } from '@/app/[userCode]/list/[id]/_components/ListCard/_components/ListCardDescription';
import ListCardHeader from '@/app/[userCode]/list/[id]/_components/ListCard/_components/ListCardHeader';
import useListCard from '@/app/[userCode]/list/[id]/_components/ListCard/_hooks/useListCard';
import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconAddCircle from '@/components/ui/icons/AddCircleIcon';
import IconEdit from '@/components/ui/icons/EditIcon';
import IconSort from '@/components/ui/icons/SortIcon';
import IconThreeDots from '@/components/ui/icons/ThreeDots';
import TrashIcon from '@/components/ui/icons/TrashIcon';
import { DrawerIds } from '@/constants/Drawer';
import { Language } from '@/enums/index.enum';
import { DropdownItemType } from '@/enums/Style/index.enum';
import { useDeleteList } from '@/hooks/api/lists/useDeleteList';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { getFormattedTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IListCardProps {
  data: GetListsResponse['content'];
}

const ListCard: React.FC<IListCardProps> = ({ data }: IListCardProps) => {
  const { i18n } = useLingui();
  const navigateTo = useStrictNavigationAdapter();

  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const { withAuth } = useAuthWrapper();
  const { mutate: deleteList } = useDeleteList({
    userCode: me.userCode,
    onSuccess: () => navigateTo.user(me.userCode),
  });

  const {
    likeCount,
    ideaCount,
    drawerContent,
    setDrawerContent,
    openDrawer,
    openDeleteDrawer,
    closeDeleteDrawer,
    isUpdatedRecently,
    onClickIdea,
  } = useListCard(data);

  // TODO: move to custom hook?
  const [createdAtString, setCreatedAtString] = useState('');

  useEffect(() => {
    const locale =
      i18n.locale === (Language.ZH_TW as string) ? Language.ZH_TW : Language.EN;
    setCreatedAtString(getFormattedTime(data.createdAt, locale));
  }, [data.createdAt, i18n.locale]);

  const isOwner = isLoggedIn && me?.id === data.owner.id;

  const buildIdeaCreateUrl = () => {
    const params = new URLSearchParams();
    params.set('listID', data.id.toString());
    params.set('listTitle', data.title);
    return `/idea/create?${params.toString()}`;
  };

  const dropdownItems: DropdownItem[] = [
    {
      type: DropdownItemType.ITEM,
      label: t`Edit List Info`,
      onClick: () => navigateTo.editList(me.userCode, data.id.toString()),
      icon: <IconEdit />,
    },
    {
      type: DropdownItemType.ITEM,
      label: t`Add Idea`,
      onClick: () => navigateTo.createIdea(buildIdeaCreateUrl()),
      icon: <IconAddCircle />,
    },
    {
      type: DropdownItemType.ITEM,
      label: t`Reorder Idea`,
      onClick: () => navigateTo.reorderList(me.userCode, data.id.toString()),
      icon: <IconSort />,
    },
    { type: DropdownItemType.SEPARATOR },
    {
      type: DropdownItemType.ITEM,
      label: t`Delete List`,
      onClick: () => openDeleteDrawer(),
      icon: <TrashIcon />,
      danger: true,
    },
  ];

  const onDeleteList = withAuth(() => {
    deleteList({ params: { listID: data.id } });
  });

  const handleExpandContent = (content: React.ReactNode) => {
    setDrawerContent(content);
    openDrawer();
  };

  return (
    <>
      <div className="relative flex flex-col items-center rounded-[32px] border border-black bg-white pb-10 pt-6">
        {/* Owner Dropdown */}
        {isOwner && (
          <DropdownMenuComponent
            trigger={
              <div
                className={cn(
                  'absolute right-4 flex h-7 w-7 items-center justify-center',
                  isUpdatedRecently() ? 'top-6' : 'top-5'
                )}
              >
                <IconThreeDots width={17.5} />
              </div>
            }
            items={dropdownItems}
          />
        )}

        {/* Header: Title, Category, Likes, Date */}
        <ListCardHeader
          title={data.title}
          categoryID={data.categoryID}
          ideaCount={ideaCount}
          likeCount={likeCount}
          createdAtString={createdAtString}
          isUpdatedRecently={isUpdatedRecently()}
        />

        {/* Description & External Link */}
        <div className="w-full px-4">
          <ListCardDescription
            description={data.description}
            externalLink={data.externalLink}
            onExpandDescription={handleExpandContent}
          />
        </div>

        {/* Cover Image */}
        {data.coverImage && (
          <div className="mt-4 px-4">
            <Image
              src={data.coverImage}
              alt={data.title}
              width={374}
              height={374}
              className="rounded-xl border border-black"
            />
          </div>
        )}

        {/* Owner: Add Idea */}
        {isOwner && (
          <AddIdeaRow
            onClick={() => navigateTo.createIdea(buildIdeaCreateUrl())}
          />
        )}

        {data.ideaTotalCount > 0 ? (
          <IdeaList listID={data.id.toString()} onClickIdea={onClickIdea} />
        ) : (
          <div className="mt-4 w-full whitespace-pre-line px-4 text-[15px] text-black-gray-03">
            {isOwner ? (
              <Trans>This list has no ideas yet.\nAdd your first idea.</Trans>
            ) : (
              <Trans>Ideas will appear here soon.\nFollow for updates.</Trans>
            )}
          </div>
        )}
      </div>

      {/* Content Drawer (description / external link / idea detail) */}
      <DrawerComponent
        drawerId={DrawerIds.LIST_CARD_DRAWER_ID}
        isShowClose={false}
        content={drawerContent}
        className="max-h-[calc(100dvh-200px)] px-0 py-0"
      />

      {/* Delete Confirmation Drawer */}
      <DrawerComponent
        drawerId={DrawerIds.DELETE_LIST_DRAWER_ID}
        isShowClose={true}
        header={
          <Trans>Deleting the list title will also erase all ideas!</Trans>
        }
        subHeader={
          <Trans>
            Permanently delete the entire list and all its ideas. This action
            cannot be undone!
          </Trans>
        }
        startFooter={
          <Button
            onClick={() => {
              closeDeleteDrawer();
              onDeleteList();
            }}
            variant={ButtonVariant.WARNING}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Delete List and All Ideas</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => closeDeleteDrawer()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Cancel</Trans>
          </Button>
        }
      />
    </>
  );
};

export default ListCard;
