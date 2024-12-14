import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import { Trans } from '@lingui/macro';
import React, { useEffect, useRef } from 'react';

interface IdeaListProps {
  // Add any props you need for the page
}

const IdeaListSection: React.FC<IdeaListProps> = () => {
  const ideaList = [
    {
      title: '（最新的靈感）',
      description: `你可以在使用者操作軟體工具時，透過 AI 自動截圖記錄步驟，生成圖文操作說明文件，省下撰寫逐步截圖、撰寫文件時間！\n不論是向客戶教學軟體操作步驟、數位工具導入後的內部培訓，都可以運用 Tango 來實現，幫你快速生成步驟指南文件！`,
      coverImage:
        'data:image/jpeg;base64,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',
    },
    {
      title: 'Tango 可以做什麼？',
      description: '',
      coverImage: '',
    },
    {
      title: '最舊的靈感',
      description: `你可以在使用者操作軟體工具時，透過 AI 自動截圖記錄步驟，生成圖文操作說明文件，省下撰寫逐步截圖、撰寫文件時間！\n不論是向客戶教學軟體操作步驟、數位工具導入後的內部培訓，都可以運用 Tango 來實現，幫你快速生成步驟指南文件！`,
    },
  ];

  const footerRef = useRef<HTMLDivElement>(null);

  const footerPosition = () => {
    if (footerRef.current && window.visualViewport) {
      footerRef.current.style.top = `${window.visualViewport.height - footerRef.current.offsetHeight}px`;
    }
  };
  useEffect(() => {
    footerPosition();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2">
        {ideaList?.map(idea => (
          <div className="border border-l-gray-main-03 bg-gray-note-05 py-2 px-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <div className="text-black-text-01 font-semibold text-t1">{idea.title}</div>
                <div className="line-clamp-1 text-t3 text-black-tint-04">{idea.description}</div>
              </div>
              {idea.coverImage && (
                <img
                  src={idea.coverImage}
                  className="w-10 h-10 rounded border-black-tint-04 border"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        ref={footerRef}
        className="border-t-gray-main-03 border-t fixed flex px-4 py-2 w-dvw justify-between left-0 z-10"
      >
        <div className="flex items-center gap-2">
          <Button aria-label="Previous" className="p-0 h-auto rounded-full bg-inherit">
            <IconClose />
          </Button>
          <Trans>Edit List</Trans>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled variant="black" shape="rounded8px">
            <Trans>Save New Order</Trans>
          </Button>
          <Button variant="black" shape="rounded8px">
            <Trans>Done</Trans>
          </Button>
        </div>
      </div>
    </>
  );
};

export default IdeaListSection;
