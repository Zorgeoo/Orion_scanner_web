export type ProductModel = [
  number, // 0 - id 0
  string, // 1 - barcode + name
  string, // 2 - quantity & price "Тоо.х: 5.00, Үнийн дүн: 85,000.00, , admin"
  string, // 3 - Дотоод код
  string, // 4 - Барааны нэр
  string, // 5 - Баркод
  number, // 6 - тоо хэмжээ
  string, // 7 - Сери
  number, // 8 - Авсан үнэ
  string | Record<string, unknown>, // 9 - дуусах хугацаа
  string | Record<string, unknown>, // 10 - дуусах хугацаа
  number, // 11 - Зарах үнэ
  string // 12
];
