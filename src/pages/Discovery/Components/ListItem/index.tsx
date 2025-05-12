import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LatestList } from '@/types/Discovery';

const ListItem = ({ listItem }: { listItem: LatestList }) => {
  return (
    <Link
      to={`/`}
      className="flex flex-row items-center justify-between border-t border-gray-02 p-4"
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
    </Link>
  );
};

export default ListItem;
