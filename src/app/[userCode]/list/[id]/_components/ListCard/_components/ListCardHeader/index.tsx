import IconPrivateEye from '@/components/ui/icons/PrivateEyeIcon';
import IconPublicEye from '@/components/ui/icons/PublicEyeIcon';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { ListType } from '@/enums/Lists/index.enum';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
interface ListCardHeaderProps {
  title: string;
  categoryID: number;
  ideaCount: number;
  likeCount: number;
  listType: ListType;
  createdAtString: string;
  isUpdatedRecently: boolean;
}

const ListCardHeader: React.FC<ListCardHeaderProps> = ({
  title,
  categoryID,
  ideaCount,
  likeCount,
  listType,
  createdAtString,
  isUpdatedRecently,
}: ListCardHeaderProps) => {
  const { i18n } = useLingui();

  return (
    <div className="flex w-full flex-col items-center px-4">
      {isUpdatedRecently && (
        <div className="-tracking-0.8% mb-2 flex h-[27px] items-center justify-center rounded-full bg-yellow-bright-01 px-4 text-t2 font-semibold">
          <Trans>Recently Updated</Trans>
        </div>
      )}
      <div className="tracking-0.8% text-t2">
        <Trans>Listing since</Trans> {createdAtString}
      </div>
      <div className="-tracking-2% mt-4 break-normal text-center text-h1 font-extrabold [overflow-wrap:anywhere]">
        {title}
      </div>
      <div className="tracking-0.8% mt-4 flex items-center gap-2 text-t2">
        <p>{i18n._(CategoriesI18n[categoryID])}</p>
        <p>•</p>
        <p>
          {ideaCount} <Trans>Ideas</Trans>
        </p>
        <p>•</p>
        <p>
          {likeCount} <Trans>Likes</Trans>
        </p>
        <p>•</p>
        <p className="flex items-center justify-center gap-1">
          {listType === ListType.PUBLIC ? (
            <IconPublicEye />
          ) : (
            <IconPrivateEye />
          )}
          {listType === ListType.PUBLIC && <Trans>Public</Trans>}
          {listType === ListType.PRIVATE && <Trans>Secret</Trans>}
        </p>
      </div>
    </div>
  );
};

export default ListCardHeader;
