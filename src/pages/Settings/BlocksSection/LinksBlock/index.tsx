import IconRightArrow from '@/components/ui/icons/RightArrowIcon';
import { openWindow } from '@/lib/openLink';
import { IActionItem, ILinksBlock } from '@/types/Settings';

type ILinksBlockProps = ILinksBlock;

const LinksBlock: React.FC<ILinksBlockProps> = ({ title, actionItems }) => {
  const handleClick = (item: IActionItem) => {
    if (item.action !== undefined) {
      return item.action;
    }
    if (item.link !== undefined) {
      return () => {
        // TODO: To determine if it's internal or external
        openWindow(item.link);
      };
    }
    return () => {
      console.error(`No action or link is set: <${item.decription}>`);
    };
  };

  return (
    <div role="links-block">
      <div className="py-2">
        <h2 className="text-[15px] font-semibold">{title}</h2>
      </div>
      {actionItems.map((item) => {
        return (
          <div
            key={item.decription}
            className="flex h-14 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-1"
            onClick={handleClick(item)}
          >
            <p>{item.decription}</p>
            <IconRightArrow />
          </div>
        );
      })}
    </div>
  );
};

export default LinksBlock;
