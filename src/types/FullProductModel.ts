// export type FullProductModel = [
//   number, // 0 - lineId 0
//   string, // 1 - product name
//   string, // 2 - quantity & price "Тоо.х: 5.00, Үнийн дүн: 85,000.00, , admin"
//   string, // 3 - Дотоод код /group-number/
//   string, // 4 - Барааны нэр
//   string, // 5 - Баркод
//   number, // 6 - тоо хэмжээ
//   string, // 7 - Сери
//   number, // 8 - Авсан үнэ
//   string | Record<string, unknown>, // 9 - дуусах хугацаа
//   string | Record<string, unknown>, // 10 - дуусах хугацаа
//   number, // 11 - Зарах үнэ
//   string // 12
// ];

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
