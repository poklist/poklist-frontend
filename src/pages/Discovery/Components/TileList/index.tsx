import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Avatar } from '@/components/ui/avatar';
import { OfficialCollection } from '@/types/Discovery';
import { Link } from 'react-router-dom';

const TileList = ({
  officialCollection,
}: {
  officialCollection: OfficialCollection;
}) => {
  return (
    <Link to={`/`} className="flex flex-col gap-2">
      <header className="flex items-center justify-start">
        <h1 className="line-clamp-2 text-t1 font-semibold">
          {officialCollection.title}
        </h1>
      </header>
      <div>
        <img
          src={officialCollection.coverImage}
          alt="Official Collection Cover Image"
          className="size-[202px] rounded-lg border border-black object-cover"
        />
      </div>
      <footer className="flex flex-row items-center justify-start gap-1">
        <Avatar className="size-6">
          <AvatarImage src={officialCollection.owner.profileImage} />
          <AvatarFallback>
            {officialCollection.owner.userCode[0]}
          </AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 text-t3 text-black">
          {officialCollection.owner.displayName}
        </p>
      </footer>
    </Link>
  );
};

export default TileList;
