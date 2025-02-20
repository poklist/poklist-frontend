export interface ListPreview {
  id: number;
  title: string;
  description: string;
  coverImage: string;
}

// TODO: conflict with IListInfo
export interface List {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  ideas: IdeaPreview[];
  ideaTotalCount: number;
  owner: UserPreview;
}
