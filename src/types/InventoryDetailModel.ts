export interface InventoryDetailModel {
  groupNum: string;
  name: string;
  barcode: string;
  price: number;
  qtyAndInfo?: string;
  seriesNumber?: string;
  endDate?: string | Date;
  cost: string;
}
