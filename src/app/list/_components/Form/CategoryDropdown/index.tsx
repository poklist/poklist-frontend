import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import IconPencil from '@/components/ui/icons/PencilIcon';
import { cn } from '@/lib/utils';
import { t, Trans } from '@lingui/macro';
import { useState } from 'react';

export interface CategoryOption {
  title: string;
  content: string;
  categoryID?: number;
}

interface CategoryDrawerProps {
  onSelect: (option: CategoryOption) => void;
}

const CategoryDropdown = ({ onSelect }: CategoryDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const categoryOptions: CategoryOption[] = [
    {
      title: t`讓我工作快一點的小技巧`,
      content: t`從快捷鍵、工作流到 AI 工具，分享每天省下一點時間的小攻略...`,
    },
    {
      title: t`那些沒人教我的職場生存術`,
      content: t`從開會、回訊息到跟主管溝通，分享工作幾年後才慢慢學會的事...`,
    },
    {
      title: t`我的懶人省錢理財術`,
      content: t`從訂閱服務、3C 到生活用品，分享省錢方法、理財小小心法...`,
    },
    {
      title: t`下班後讓我回血的運動儀式`,
      content: t`從散步、伸展、排舞到重訓，分享我從工作模式切回自己的流程...`,
    },
    {
      title: t`最近讓我重新有動力的內容`,
      content: t`這裡收集所有配飯的好劇、當背景播的 Podcast、有感的好文章...`,
    },
    {
      title: t`那些讓我深刻的好書`,
      content: t`從工作效率、職涯成長到自我探索，分享最近讀完有感的幾本...`,
    },
    {
      title: t`長大後不再勉強自己的事`,
      content: t`從不想去的聚會到不必要的迎合，記錄開始更忠於自己的人生選擇...`,
    },
    {
      title: t`這個月的心情筆記本`,
      content: t`從焦慮、好笑又想哭的瞬間，留下每天腦袋裡正在發生的事...`,
    },
    {
      title: t`無限回訪！一個人也要去的地方`,
      content: t`從咖啡廳到個性小店，分享一個人也會無限回訪的口袋名單...`,
    },
  ];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col text-t1 font-semibold"
    >
      <p className="mb-2">
        <Trans>想分享什麼名單主題？</Trans>
      </p>
      <CollapsibleTrigger className="flex items-center gap-2 font-normal text-black-gray-03">
        <Trans>看看大家在寫什麼</Trans>
        <IconLeftArrow
          aria-hidden
          className={cn(
            '-rotate-90 transition-transform duration-200 motion-reduce:transition-none',
            { 'rotate-90': isOpen }
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 pt-2">
          {categoryOptions.map((option) => (
            <button
              key={option.title}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              type="button"
              className="flex w-full items-center gap-4 rounded-xl border border-smart-purple bg-smart-purple/5 px-4 py-2 text-left"
            >
              <IconPencil className="size-4 shrink-0 text-black-text-01" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-t1 font-semibold text-black-text-01">
                  {option.title}
                </p>
                <p className="truncate text-t3 font-normal text-black-text-01">
                  {option.content}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CategoryDropdown;
