import React from 'react';
import { DrawerComponent } from '@/components/Drawer';
import { DrawerIds } from '@/constants/Drawer';
import {
  Button,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from '@/components/ui/button';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { Trans } from '@lingui/react/macro';
import { useDrawer } from '@/components/Drawer/useDrawer';
import CreateHintChinese from '@/assets/images/hint/create_hint_chinese.svg';
import Image from 'next/image';

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
    // TODO: ...
  });

  const drawerContent = (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex justify-center">
        <Image
          src={CreateHintChinese}
          alt="Create Hint"
          width={280}
          height={160}
          className="w-max-w-full h-auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">
          <Trans>說說你的好點子</Trans>
        </h2>
        <p className="text-t1">
          <Trans>先來創個新名單，還是記下靈感，隨心所欲！</Trans>
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
