export interface IdeaPreview {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  externalLink?: string;
}

export interface IdeaDetail {
  createdAt: string;
  updatedAt: string;
}

export interface Idea extends IdeaPreview, IdeaDetail {
  listID: number;
  ownerID: number;
}
