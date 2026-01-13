export interface InventoryDetailModel {
  groupNum: string;
  name: string;
  barcode: string;
  price: number;
  priceAndInfo?: string;
  seriesNumber?: string;
  endDate?: string | Date;
  cost: string;
}
