import DropdownMenuComponent, {
  DropdownItem,
} from '@/app/[userCode]/list/[id]/_components/DropdownMenu';
import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconEdit from '@/components/ui/icons/EditIcon';
import IconLink from '@/components/ui/icons/LinkIcon';
import IconThreeDots from '@/components/ui/icons/ThreeDots';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { DrawerIds } from '@/constants/Drawer';
import { SocialLinkType } from '@/enums/index.enum';
import { DropdownItemType, MessageType } from '@/enums/Style/index.enum';
import { useGetIdea } from '@/hooks/api/ideas/useGetIdea';
import useDeleteIdea from '@/hooks/mutations/useDeleteIdea';
import { useAuthWrapper } from '@/hooks/useAuth';
import useClipboard from '@/hooks/useClipboard';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { openWindow } from '@/lib/openLink';
import { getFormattedTime } from '@/lib/time';
import { urlPreview } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface IIdeaDrawerContentProps {
  ideaID: string;
}

const IdeaDrawerContent: React.FC<IIdeaDrawerContentProps> = ({
  ideaID,
}: IIdeaDrawerContentProps) => {
  const { i18n } = useLingui();
  const navigateTo = useStrictNavigationAdapter();
  const { me } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const { withAuth } = useAuthWrapper();
  const { copy } = useClipboard();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data } = useGetIdea({ ideaID, enabled: !isDeleting });
  const { deleteIdea } = useDeleteIdea({
    listID: String(data?.listID),
  });
  const { openDrawer, closeDrawer } = useDrawer(
    DrawerIds.DELETE_IDEA_DRAWER_ID
  );

  const { closeDrawer: closeSelf } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);

  const handleCopyHref = () => {
    if (!data) return;
    void copy(`${window.location.href}/idea/${data.id}`);
    toast({
      title: t`Copied to clipboard`,
      variant: MessageType.SUCCESS,
    });
  };

  const dropdownItems: DropdownItem[] = [
    {
      type: DropdownItemType.ITEM,
      label: t`Edit Idea`,
      onClick: () => {
        if (!data) return;
        closeSelf();
        navigateTo.editIdea(data?.id);
      },
      icon: <IconEdit />,
    },
    { type: DropdownItemType.SEPARATOR },
    {
      type: DropdownItemType.ITEM,
      label: t`Delete Idea`,
      onClick: () => openDrawer(),
      icon: <TrashIcon />,
      danger: true,
    },
  ];

  const onDeleteIdea = withAuth(() => {
    if (!data) return;
    setIsDeleting(true);
    deleteIdea(data.id, {
      onSuccess: () => {
        closeSelf();
        navigateTo.viewList(me.userCode, String(data.listID));
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  });

  return (
    <>
      <div className="flex flex-col items-start overflow-y-auto pb-6 pl-6 pt-4">
        {isLoggedIn && me?.id === data?.owner.id && (
          <div className="mb-2 flex w-full justify-end pr-6">
            <DropdownMenuComponent
              trigger={
                <div className="flex h-7 w-7 items-center justify-center">
                  <IconThreeDots width={17.5} />
                </div>
              }
              items={dropdownItems}
            />
          </div>
        )}
        {data?.coverImage && (
          <Image
            src={data.coverImage || ''}
            alt={data.title}
            width={240}
            height={240}
            className="mb-6 mr-6 self-center rounded-2xl border border-black"
          />
        )}
        <div className="-tracking-2% break-normal pr-6 text-[17px] font-bold leading-[1.45] [overflow-wrap:anywhere]">
          {data?.title}
        </div>
        {data?.description && (
          <div className="mt-1 w-full whitespace-pre-line break-normal pr-5 text-[15px] leading-[1.45] -tracking-1.1% [overflow-wrap:anywhere]">
            {data.description}
          </div>
        )}
        {data?.externalLink && (
          <div
            className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start pr-6 text-[13px]"
            onClick={() => {
              openWindow(data.externalLink);
            }}
          >
            <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
            <p className="line-clamp-1 max-w-40 truncate block">
              {urlPreview(data.externalLink)}
            </p>
          </div>
        )}
        <div className="flex w-full items-center justify-between pr-6 mb-20">
          {data?.createdAt && (
            <p className="mt-4 text-[13px] text-black-text-01">
              {getFormattedTime(data.createdAt, i18n.locale)}
            </p>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 w-full pb-4 pt-2 bg-gray-note-05 px-6">
        <Button
          variant={ButtonVariant.GRAY}
          shape={ButtonShape.ROUNDED_FULL}
          size={ButtonSize.H40}
          className="flex gap-1 border border-note-gray-06 text-[13px] text-black-gray-03"
          onClick={handleCopyHref}
        >
          <IconLink width={13} height={13} />
          <Trans>Copy</Trans>
        </Button>
      </div>
      <DrawerComponent
        drawerId={DrawerIds.DELETE_IDEA_DRAWER_ID}
        isShowClose={true}
        header={<Trans>Are you sure you want to delete this idea?</Trans>}
        subHeader={<Trans>Once deleted, this idea cannot be recovered!</Trans>}
        startFooter={
          <Button
            onClick={() => {
              closeDrawer();
              onDeleteIdea();
            }}
            variant={ButtonVariant.WARNING}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Confirm Delete</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => closeDrawer()}
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

export default IdeaDrawerContent;
