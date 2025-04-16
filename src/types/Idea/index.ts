import { UserPreview } from '../User';

export interface IdeaBody {
  title: string;
  description?: string;
  coverImage?: string | null;
  externalLink?: string;
}

export interface IdeaPreview extends IdeaBody {
  id: number;
}

export interface IdeaDetail {
  createdAt: string;
  updatedAt: string;
}

export interface Idea extends IdeaPreview, IdeaDetail {
  listID: number;
  ownerID: number;
}

export interface IdeaResponse extends Omit<Idea, 'ownerID'> {
  owner: UserPreview;
}

export interface CreateIdeaRequest extends IdeaBody {
  listID: number;
}

export interface CreateIdeaResponse extends CreateIdeaRequest {
  id: number;
}

export interface EditIdeaResponse extends IdeaPreview {
  listID: number;
}
