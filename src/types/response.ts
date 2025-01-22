import { ListPreview } from './List/index.d';

export interface GetListPreviewListResponse {
  lists: ListPreview[];
}

export interface IResponse<T> {
  code?: number;
  message?: string;
  content?: T;
  offset?: number;
  limit?: number;
  totalElements?: number;
}
