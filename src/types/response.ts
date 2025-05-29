export interface IResponse<T> {
  code?: string | number;
  message?: string;
  content?: T;
  offset?: number;
  limit?: number;
  totalElements?: number;
}
