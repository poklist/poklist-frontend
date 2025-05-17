import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LatestList } from '@/types/Discovery';
import useStrictNavigate from '@/hooks/useStrictNavigate';

const ListItem = ({ listItem }: { listItem: LatestList }) => {
  const navigateTo = useStrictNavigate();

  return (
    <div
      className="flex flex-row items-center justify-between border-t border-gray-02 p-4"
      onClick={() => {
        navigateTo.viewList(listItem.owner.userCode, listItem.id.toString());
      }}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2 overflow-hidden">
        <Avatar className="size-10 flex-shrink-0">
          <AvatarImage src={listItem.owner.profileImage} />
          <AvatarFallback>{listItem.owner.userCode[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-t1 font-semibold text-black-text-01">
            {listItem.title}
          </p>
        </div>
      </div>
      <ChevronRight className="ml-4 h-5 w-5 flex-shrink-0" />
    </div>
  );
};

export default ListItem;
