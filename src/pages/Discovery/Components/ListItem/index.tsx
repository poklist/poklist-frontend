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
      <div className="flex flex-row items-center justify-start gap-2">
        <Avatar className="size-10">
          <AvatarImage src={listItem.owner.profileImage} />
          <AvatarFallback>{listItem.owner.userCode[0]}</AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 text-t1 font-semibold text-black-text-01">
          {listItem.title}
        </p>
      </div>
      <ChevronRight className="h-5 w-5" />
    </div>
  );
};

export default ListItem;
