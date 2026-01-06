export interface APIResponse {
  is_succeeded: boolean;
  msg: string;
  result?: string[][] | null;
}
