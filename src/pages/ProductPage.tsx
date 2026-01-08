import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { FullProductModel } from "@/types/FullProductModel";
import CustomButton from "@/components/common/CustomButton";
// import { saveProductQuantity } from "@/api/services";
import { UserContext } from "@/context/UserContext";

const ProductPage = () => {
  const context = useContext(UserContext);

  if (!context) return null; // fallback if context not provided

  const { userInfo } = context;

  const location = useLocation();
  const product = location.state?.product as FullProductModel | undefined;

  // quantity editable (index 6 in your tuple)
  const [quantity, setQuantity] = useState<number | null>(product?.[6] ?? null);

  if (!product) return <p className="p-4">No product data available</p>;

  //   const saveQuantity = async () => {
  //     try {
  //       if (userInfo?.dbase?.dbName) {
  //         const res = await saveProductQuantity(userInfo?.dbase?.dbName, product);
  //         console.log(res);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {product[1]}
              </h1>
            </div>
          </div>
        </div>

        {/* Quantity Input Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тоо хэмжээ
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity ? quantity : ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full text-xl font-bold text-gray-800 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  ширхэг
                </div>
              </div>
            </div>
            <div className="pt-7">
              <CustomButton title="Хадгалах" />
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Дэлгэрэнгүй мэдээлэл
          </h2>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              Дотоод код
            </span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product[3]}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Нэр</span>
            <span className="text-sm font-semibold text-gray-800">
              {product[4]}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Barcode</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product[5]}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Үлдэгдэл</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product[6]}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Сери</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product[7]}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              Дуусах хугацаа
            </span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {typeof product[10] === "string" && product[10]}
            </span>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-1">
                Авсан үнэ
              </p>
              <p className="text-2xl font-bold text-green-700">{product[8]}₮</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-medium text-blue-600 mb-1">
                Зарах үнэ
              </p>
              <p className="text-2xl font-bold text-blue-700">{product[11]}₮</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
