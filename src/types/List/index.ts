import { Category as CategoryEnum } from '@/enums/Lists/index.enum';
import { IdeaPreview } from '../Idea';
import { UserPreview } from '../User';

export interface ListPreview {
  id: number;
  title: string;
  description: string;
  coverImage?: string | null;
}

export interface ListCover extends ListPreview {
  externalLink: string;
  categoryID: number;
}

export interface ListSocialStats {
  likeCount: number;
}

export interface ListSocialStatus {
  isLiked: boolean;
}

export interface ListDetail {
  createdAt: string;
  updatedAt: string;
}

// TODO: conflict with IListInfo
export interface List
  extends ListCover,
    ListSocialStats,
    ListSocialStatus,
    ListDetail {
  ideas: IdeaPreview[];
  ideaTotalCount: number;
  owner: UserPreview;
}

export interface Category {
  id: CategoryEnum;
  name: string;
}
