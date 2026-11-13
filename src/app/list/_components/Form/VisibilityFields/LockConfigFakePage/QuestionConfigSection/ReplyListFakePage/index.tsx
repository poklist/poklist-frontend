import { useFakePage } from '@/components/FakePage/useFakePage';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import { Trans } from '@lingui/macro';
import React from 'react';

const ReplyListFakePage: React.FC = () => {
  const { isOpen, closeFakePage, getPayload } = useFakePage();
  const open = isOpen('replyList');
  const replyList = getPayload('replyList');

  const onClosePage = () => {
    closeFakePage('replyList');
  };

  return (
    <Dialog open={open} onOpenChange={onClosePage}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-dvh w-full items-center border-0 bg-transparent p-0"
      >
        <div className="z-20 flex h-full w-full flex-col items-center bg-gray-note-05 px-4 pt-14 md:max-w-mobile-max">
          <div className="fixed top-0 z-10 flex h-14 w-full justify-between overflow-hidden border-b border-b-note-gray-06 bg-white px-4 py-2">
            <div className="flex flex-1 items-center justify-between gap-1 font-bold">
              <div
                onClick={() => onClosePage()}
                data-testid="reply-list-back"
                aria-label="Previous"
                className="flex items-center justify-between gap-5 pl-4 text-h2 font-bold text-black-text-01"
              >
                <IconLeftArrowThin width={7.5} height={15} />
                <Trans>
                  收到 {replyList?.length !== undefined ? replyList?.length : 0}{' '}
                  則回覆
                </Trans>
              </div>
            </div>
          </div>
          <div className="mt-10 flex w-full flex-col gap-6">
            {replyList?.length === 0 || replyList === null ? (
              <div className="mx-auto flex w-60 flex-col justify-center gap-6 text-center text-t1 text-black-gray-03">
                <div className="">
                  <Trans>尚無回覆</Trans>
                </div>
                <Trans>
                  分享名單截圖在你的社群限動上，幫助更多人知道這份好名單！
                </Trans>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyListFakePage;
