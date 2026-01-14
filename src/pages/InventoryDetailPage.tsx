import { getInventoryDetail } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { InventoryDetailModel } from "@/types/InventoryDetailModel";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InventoryDetailPage = () => {
  const userContext = useContext(UserContext);
  if (!userContext) return null;

  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<InventoryDetailModel | null>(null);

  useEffect(() => {
    const getDetail = async () => {
      setIsLoading(true);
      if (!userInfo?.dbase?.dbName || !groupNum || !userInfo.userId) return;
      try {
        const res = await getInventoryDetail(
          userInfo?.dbase?.dbName,
          groupNum,
          userInfo?.userId
        );
        if (res.success) {
          setProduct(res.product);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getDetail();
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-col gap-4">
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
                {product?.groupNum}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Нэр</span>
              <span className="text-sm font-semibold text-gray-800">
                {product?.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Баркод</span>
              <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {product?.barcode}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Зарах үнэ
              </span>
              <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {product?.price.toLocaleString()}₮
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Нэр</span>
              <span className="text-sm font-semibold text-gray-800">
                {product?.qtyAndInfo}
              </span>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-4">
            <div className="text-sm text-gray-700 font-semibold">
              Сүүлд орлогод авсан сери, дуусах хугацаа:
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Сери</span>
              <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {product?.seriesNumber}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Дуусах хугацаа
              </span>
              <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {product?.endDate &&
                  typeof product.endDate === "string" &&
                  product.endDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Авсан үнэ
              </span>
              <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {product?.cost.toLocaleString() + "₮"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InventoryDetailPage;
