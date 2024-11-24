import { ListCategory } from '@/types/enum';

export interface UserResponse {
  id: string;
  displayName: string;
  profileImage: string;
  userCode: string;
  bio: string;
}

export interface IdeaPreview {
  id: number;
  title: number;
  description: string;
  coverImage: string;
}

export interface ListResponse {
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: ListCategory;
  likeCount: number;
  ideas: IdeaPreview[];
}

export interface IdeaResponse {
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
}
