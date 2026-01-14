export interface ParamModel {
  name: String;
  type: String;
  length: number;
  value: String | number | Record<string, unknown>;
}
