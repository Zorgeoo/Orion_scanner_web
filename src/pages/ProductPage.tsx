import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FullProductModel } from "@/types/FullProductModel";
import CustomButton from "@/components/common/CustomButton";
import { saveProductQuantity } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { showToast } from "@/utils/toast";
import { ProductContext } from "@/context/ProductContext";

const ProductPage = () => {
  const context = useContext(UserContext);

  if (!context) return null;

  const { userInfo } = context;

  const productContext = useContext(ProductContext);

  if (!productContext) return null;

  const { currentCounting, shouldStartScan, setStartScanNow } = productContext;

  const navigate = useNavigate();

  const location = useLocation();

  const product = location.state?.product as FullProductModel | undefined;
  if (!product) return <p className="p-4">No product data available</p>;

  const [quantity, setQuantity] = useState<number | null>(
    product?.quantity ?? null
  );

  const saveQuantity = async () => {
    try {
      if (userInfo?.dbase?.dbName && quantity != null && currentCounting) {
        const res = await saveProductQuantity(
          userInfo?.dbase?.dbName,
          product,
          quantity,
          userInfo.userId,
          currentCounting?.id
        );

        if (res) {
          if (shouldStartScan) {
            setStartScanNow(true);
          } else {
            setStartScanNow(false);
          }
          navigate(-1);
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
    <div className="min-h-screen p-4">
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
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9,]*"
                  value={quantity !== null ? quantity : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(value === "" ? null : Number(value));
                  }}
                  className="w-full text-lg font-bold text-gray-800 border-2 border-gray-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
            <span className="text-sm font-medium text-gray-600">Баркод</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.barcode}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Зарах үнэ</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.sellingPrice.toLocaleString()}₮
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
              {product.expiryDisplay &&
              typeof product.expiryDisplay === "string"
                ? new Date(product.expiryDisplay)
                    .toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                    })
                    .replace("-", "/")
                : ""}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Авсан үнэ</span>
            <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
              {product.costPrice.toLocaleString()}₮
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
