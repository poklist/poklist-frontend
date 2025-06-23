import randomImage1 from '@/assets/images/officialCover/random-image-1.png';
import randomImage2 from '@/assets/images/officialCover/random-image-2.png';
import randomImage3 from '@/assets/images/officialCover/random-image-3.png';
import randomImage4 from '@/assets/images/officialCover/random-image-4.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { OfficialCollection } from '@/types/Discovery';

const fallbackImages = [randomImage1, randomImage2, randomImage3, randomImage4];

const TileList = ({
  officialCollection,
}: {
  officialCollection: OfficialCollection;
}) => {
  const navigateTo = useStrictNavigationAdapter();

  // 隨機選擇一張圖片作為封面圖的備用方案
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[randomIndex].src;
  };

  // 如果封面圖不存在，則使用隨機圖片
  const coverImage = officialCollection.coverImage || getRandomImage();

  return (
    <div
      className="flex w-full max-w-[202px] flex-col gap-2"
      onClick={() => {
        navigateTo.viewList(
          officialCollection.owner.userCode,
          officialCollection.id.toString()
        );
      }}
    >
      <header className="flex items-center justify-start">
        <h1 className="line-clamp-2 text-t1 font-semibold">
          {officialCollection.title}
        </h1>
      </header>
      <div className="flex justify-center">
        <img
          src={coverImage || null}
          alt="Official Collection Cover Image"
          loading="lazy"
          className="aspect-square w-full max-w-[202px] rounded-lg border border-black object-cover"
        />
      </div>
      <footer className="flex flex-row items-center justify-start gap-1">
        <Avatar className="size-6">
          <AvatarImage src={officialCollection.owner.profileImage || null} />
          <AvatarFallback>
            {officialCollection.owner.userCode[0]}
          </AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 text-t3 text-black">
          {officialCollection.owner.displayName}
        </p>
      </footer>
    </div>
  );
};

export default TileList;
