export interface BaseResponse<T> {
  is_succeeded: boolean;
  msg: string;
  result?: T | null;
}
