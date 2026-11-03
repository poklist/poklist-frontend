import PasswordConfigSection from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage/PasswordConfigSection';
import QuestionConfigSection from '@/app/list/_components/Form/VisibilityFields/LockConfigFakePage/QuestionConfigSection';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { useFakePage } from '@/components/FakePage/useFakePage';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import { DrawerIds } from '@/constants/Drawer';
import { ListLockMethod } from '@/enums/Lists/index.enum';
import { ListLockSchema } from '@/types/common';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import z from 'zod';

type ListLock = z.infer<typeof ListLockSchema>;

interface LockConfigPageProps {
  isEdit: boolean;
  lock: ListLock;
  onDone: (lock: ListLock) => void;
}

const LockConfigFakePage: React.FC<LockConfigPageProps> = ({
  isEdit,
  lock,
  onDone,
}: LockConfigPageProps) => {
  const { isOpen, closeFakePage, getPayload } = useFakePage();
  const open = isOpen('lockConfig');
  const lockMethod = getPayload('lockConfig')?.lockMethod;

  const { openDrawer } = useDrawer(DrawerIds.LOCK_TYPE_EDIT_DRAWER_ID);

  // 題目暫存：null 表示尚未編輯，顯示 form 目前的題目；按「完成」才寫回 form，取消則丟掉
  const [draftQuestion, setDraftQuestion] = useState<string | null>(null);
  const question =
    draftQuestion ??
    (lock.method === ListLockMethod.QUESTION ? lock.question : '');
  const nextLock = ListLockSchema.safeParse(
    lockMethod === ListLockMethod.QUESTION
      ? { method: ListLockMethod.QUESTION, question }
      : { method: ListLockMethod.PASSWORD }
  );

  const onClosePage = () => {
    setDraftQuestion(null);
    closeFakePage();
  };

  const onConfigDone = () => {
    if (!nextLock.success) return;
    onDone(nextLock.data);
    onClosePage();
  };
  return (
    <Dialog open={open} onOpenChange={onClosePage}>
      <DialogContent
        // For console warning
        aria-describedby={undefined}
        className="flex h-dvh w-full items-center border-0 bg-transparent p-0"
      >
        <div className="z-10 flex h-full w-full flex-col items-center bg-gray-note-05 px-4 pt-14 md:max-w-mobile-max">
          <div className="fixed top-0 z-10 flex h-14 w-full justify-between overflow-hidden border-b border-b-note-gray-06 bg-white px-4 py-2">
            <div className="flex flex-1 items-center justify-between gap-1 font-bold">
              <div
                onClick={() => onClosePage()}
                aria-label="Previous"
                className="flex items-center justify-center gap-5 pl-4 text-h2 font-bold text-black-text-01"
              >
                <IconLeftArrowThin width={7.5} height={15} />
                <Trans>取消</Trans>
              </div>
              <Button
                onClick={() => onConfigDone()}
                disabled={!nextLock.success}
                data-testid="lock-config-done"
                variant={ButtonVariant.BLACK}
                size={ButtonSize.H40}
                shape={ButtonShape.ROUNDED_8PX}
                className="max-w-min px-3"
              >
                {lockMethod === ListLockMethod.PASSWORD && <Trans>完成</Trans>}
                {lockMethod === ListLockMethod.QUESTION && (
                  <Trans>儲存設定</Trans>
                )}
              </Button>
            </div>
          </div>
          <div className="mt-6 flex w-full flex-col gap-6">
            {lockMethod === ListLockMethod.PASSWORD && (
              <PasswordConfigSection />
            )}
            {lockMethod === ListLockMethod.QUESTION && (
              <QuestionConfigSection
                isEdit={isEdit}
                value={question}
                onChange={setDraftQuestion}
              />
            )}
            {isEdit && (
              <>
                <div
                  onClick={() => openDrawer()}
                  className="flex items-center justify-between text-black-text-01"
                >
                  <div className="text-t1 font-semibold">
                    <Trans>更換上鎖方式</Trans>
                  </div>
                  <IconLeftArrowThin
                    width={6}
                    height={10}
                    className="rotate-180"
                  />
                </div>
                <div className="flex items-center justify-between text-black-text-01">
                  <div className="text-t1 font-semibold">
                    <Trans>解除上鎖</Trans>
                  </div>
                  <IconLeftArrowThin
                    width={6}
                    height={10}
                    className="rotate-180"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockConfigFakePage;
