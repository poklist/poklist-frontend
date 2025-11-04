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
import useDeleteIdea from '@/hooks/mutations/useDeleteIdea';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { openWindow } from '@/lib/openLink';
import { getFormattedTime } from '@/lib/time';
import { copyHref, urlPreview } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { IdeaResponse } from '@/types/Idea';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image';

interface IIdeaDrawerContentProps {
  data: IdeaResponse;
}

const IdeaDrawerContent: React.FC<IIdeaDrawerContentProps> = ({
  data,
}: IIdeaDrawerContentProps) => {
  const { i18n } = useLingui();
  const navigateTo = useStrictNavigationAdapter();
  const { me } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const { withAuth } = useAuthWrapper();
  const { deleteIdea } = useDeleteIdea({
    listID: String(data.listID),
  });
  const { openDrawer, closeDrawer } = useDrawer(
    DrawerIds.DELETE_IDEA_DRAWER_ID
  );

  const { closeDrawer: closeSelf } = useDrawer(DrawerIds.LIST_CARD_DRAWER_ID);

  const handleCopyHref = () => {
    copyHref(`/idea/${data.id}`);
    toast({
      title: t`Copied to clipboard`,
      variant: MessageType.SUCCESS,
    });
  };

  const items: DropdownItem[] = [
    {
      type: DropdownItemType.ITEM,
      label: t`Edit Idea`,
      onClick: () => navigateTo.editIdea(data.id.toString()),
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
    deleteIdea(data.id, {
      onSuccess: () => {
        closeSelf();
        navigateTo.viewList(me.userCode, String(data.listID));
      },
    });
  });

  return (
    <>
      <div className="flex flex-col items-start overflow-y-auto px-6 pb-6 pt-4">
        {isLoggedIn && me?.id === data.owner.id && (
          <div className="mb-2 flex w-full justify-end">
            <DropdownMenuComponent
              trigger={
                <div className="flex h-5 w-5 items-center justify-center">
                  <IconThreeDots />
                </div>
              }
              items={items}
            />
          </div>
        )}
        {data.coverImage && (
          <Image
            src={data.coverImage || ''}
            alt={data.title}
            width={240}
            height={240}
            className="mt-6 self-center rounded-xl border border-black"
          />
        )}
        <div className="-tracking-2% mt-6 text-[17px] font-bold leading-[1.45]">
          {data.title}
        </div>
        {data.description && (
          <div className="mt-1 text-[15px] leading-[1.45] -tracking-1.1%">
            {data.description}
          </div>
        )}
        {data.externalLink && (
          <div
            className="mt-4 flex h-8 cursor-pointer items-center gap-2 self-start text-[13px]"
            onClick={() => {
              openWindow(data.externalLink);
            }}
          >
            <LinkIconWrapper variant={SocialLinkType.CUSTOMIZED} />
            <p className="line-clamp-1 max-w-40">
              {urlPreview(data.externalLink)}
            </p>
          </div>
        )}
        <div className="mt-4 flex w-full items-center justify-between">
          <p className="text-[13px] text-black-text-01">
            {getFormattedTime(data.createdAt, i18n.locale)}
          </p>
          <Button
            variant={ButtonVariant.WHITE}
            shape={ButtonShape.ROUNDED_FULL}
            size={ButtonSize.MD}
            className="flex gap-1"
            onClick={handleCopyHref}
          >
            <IconLink />
            <Trans>Copy</Trans>
          </Button>
        </div>
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
