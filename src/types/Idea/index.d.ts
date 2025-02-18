export interface IdeaPreview {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
}

export interface IdeaDetail extends IdeaPreview {
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
  listID: number;
  ownerID: number;
}
