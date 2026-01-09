import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FullProductModel } from "@/types/FullProductModel";
import CustomButton from "@/components/common/CustomButton";
import { saveProductQuantity } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { showToast } from "@/utils/toast";

const ProductPage = () => {
  const context = useContext(UserContext);

  if (!context) return null; // fallback if context not provided

  const { userInfo } = context;

  const navigate = useNavigate();

  const location = useLocation();

  const product = location.state?.product as FullProductModel | undefined;
  if (!product) return <p className="p-4">No product data available</p>;

  const countingId = location.state.countingId;
  if (!countingId) {
    <div>No countingId</div>;
  }

  const [quantity, setQuantity] = useState<number | null>(
    product?.quantity ?? null
  );

  const saveQuantity = async () => {
    try {
      if (userInfo?.dbase?.dbName && quantity) {
        const res = await saveProductQuantity(
          userInfo?.dbase?.dbName,
          product,
          quantity,
          userInfo.userId,
          countingId
        );
        if (res) {
          showToast.success("Амжилттай хадгаллаа.", {
            position: "bottom-center",
          });
          navigate(`/toollogo/${countingId}/searchByProductName`);
        } else {
          showToast.error("Алдаа гарлаа. Амжилтгүй", {
            position: "bottom-center",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quantity Input Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Тоолсон тоо хэмжээгээ оруулна уу:
            </div>
            <div className="flex justify-start gap-8 items-center">
              <div className="relative w-3/4">
                <input
                  type="number"
                  value={quantity ? quantity : ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full text-lg font-bold text-gray-800 border-2 border-gray-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  ширхэг
                </div>
              </div>
              <CustomButton title="Хадгалах" onClick={saveQuantity} />
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
              {product.groupNum}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Нэр</span>
            <span className="text-sm font-semibold text-gray-800">
              {product.name}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Barcode</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.barcode}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Үлдэгдэл</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.quantity}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Сери</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.serial}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              Дуусах хугацаа
            </span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {typeof product.expiryDisplay === "string" &&
                product.expiryDisplay}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Авсан үнэ</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.costPrice}₮
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Зарах үнэ</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.sellingPrice}₮
            </span>
          </div>

          {/* Price Section */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-1">
                Авсан үнэ
              </p>
              <p className="text-2xl font-bold text-green-700">
                {product.costPrice}₮
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-medium text-blue-600 mb-1">
                Зарах үнэ
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {product.sellingPrice}₮
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
