import { DrawerComponent } from '@/components/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { DrawerIds } from '@/constants/Drawer';
import { Trans } from '@lingui/macro';

interface DraftDrawerProps {
  onDelete: () => void;
  onKeep: () => void;
}

const DraftDrawer = ({ onDelete, onKeep }: DraftDrawerProps) => (
  <DrawerComponent
    drawerId={DrawerIds.LIST_DRAFT_DRAWER_ID}
    isShowClose={true}
    header={<Trans>你有一個未完成的靈感草稿</Trans>}
    subHeader={<Trans>要刪除，還是繼續編輯？</Trans>}
    content={<></>}
    startFooter={
      <Button
        onClick={onDelete}
        variant={ButtonVariant.WARNING}
        shape={ButtonShape.ROUNDED_5PX}
        data-testid="draft-delete"
      >
        <Trans>刪除草稿</Trans>
      </Button>
    }
    endFooter={
      <Button
        onClick={onKeep}
        variant={ButtonVariant.BLACK}
        shape={ButtonShape.ROUNDED_5PX}
        data-testid="draft-keep"
      >
        <Trans>繼續編輯</Trans>
      </Button>
    }
  />
);

export default DraftDrawer;
