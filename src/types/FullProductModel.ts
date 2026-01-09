export type FullProductModel = {
  lineId: number; // 0
  barcodeAndName: string; // 1
  qtyAndPrice: string; // 2
  groupNum: string; // 3
  name: string; // 4
  barcode: string; // 5
  quantity: number; // 6
  serial: string; // 7
  costPrice: number; // 8
  expiryISO: string | Record<string, unknown>; // 9
  expiryDisplay: string | Record<string, unknown>; // 10
  sellingPrice: number; // 11
  createdBy: string; // 12
};
