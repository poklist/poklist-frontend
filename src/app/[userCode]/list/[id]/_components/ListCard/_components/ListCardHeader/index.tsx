import { CategoriesI18n } from '@/constants/Lists/i18n';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
interface ListCardHeaderProps {
  title: string;
  categoryID: number;
  ideaCount: number;
  likeCount: number;
  createdAtString: string;
  isUpdatedRecently: boolean;
}

const ListCardHeader: React.FC<ListCardHeaderProps> = ({
  title,
  categoryID,
  ideaCount,
  likeCount,
  createdAtString,
  isUpdatedRecently,
}: ListCardHeaderProps) => {
  const { i18n } = useLingui();

  return (
    <div className="flex w-full flex-col items-center px-4">
      {isUpdatedRecently && (
        <div className="-tracking-0.8% mb-2 flex h-[27px] items-center justify-center rounded-full bg-yellow-bright-01 px-4 text-[13px] font-semibold">
          <Trans>Recently Updated</Trans>
        </div>
      )}
      <div className="tracking-0.8% text-[13px]">
        <Trans>Listing since</Trans> {createdAtString}
      </div>
      <div className="-tracking-2% mt-4 break-words text-center text-[26px] font-extrabold [line-break:anywhere]">
        {title}
      </div>
      <div className="tracking-0.8% mt-4 flex gap-2 text-[13px]">
        <p>{i18n._(CategoriesI18n[categoryID])}</p>
        <p>•</p>
        <p>
          {ideaCount} <Trans>Ideas</Trans>
        </p>
        <p>•</p>
        <p>
          {likeCount} <Trans>Likes</Trans>
        </p>
      </div>
    </div>
  );
};

export default ListCardHeader;
