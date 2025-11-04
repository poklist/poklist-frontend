import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import Image from 'next/image';
import React from 'react';

const CreateListOrIdeaDrawer: React.FC = () => {
  const { withAuth } = useAuthWrapper();
  const navigateTo = useStrictNavigateNext();
  const { closeDrawer } = useDrawer(DrawerIds.CREATE_LIST_OR_IDEA_DRAWER_ID);

  const handleCreateList = withAuth(() => {
    closeDrawer();
    navigateTo.createList();
  });

  const handleCreateIdea = withAuth(() => {
    closeDrawer();
    navigateTo.createIdea();
  });

  const drawerContent = (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex justify-center">
        <Image
          src={`/images/hint/create_hint_${i18n.locale}.svg`}
          alt="Create Hint"
          width={280}
          height={160}
          className="h-auto max-w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          <Trans>What’s on your mind?</Trans>
        </h2>
        <p className="text-t1">
          <Trans>A list groups your ideas. Start wherever you vibe.</Trans>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={handleCreateList}
          variant={ButtonVariant.WHITE}
          size={ButtonSize.H40}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>Create List</Trans>
        </Button>

        <Button
          onClick={handleCreateIdea}
          variant={ButtonVariant.WHITE}
          size={ButtonSize.H40}
          shape={ButtonShape.ROUNDED_8PX}
        >
          <Trans>Add Idea</Trans>
        </Button>
      </div>
    </div>
  );

  return (
    <DrawerComponent
      drawerId={DrawerIds.CREATE_LIST_OR_IDEA_DRAWER_ID}
      content={drawerContent}
      isShowClose={true}
    />
  );
};

export default CreateListOrIdeaDrawer;
