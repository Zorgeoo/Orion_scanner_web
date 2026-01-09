import { getCountingList } from "@/api/services";
import ListSkeleton from "@/components/common/ListSkeleton";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { CountingModel } from "@/types/CountingModel";
import { showToast } from "@/utils/toast";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Тооллого бүрийн type-г авж тохирох дизайн-г өгж байна
const getTypeConfig = (type: string) => {
  switch (type) {
    case "confirmed":
      return {
        label: "Батлагдсан",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "✓",
        badgeColor: "bg-green-500",
      };
    case "draft":
      return {
        label: "Ноорог",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "⏳",
        badgeColor: "bg-yellow-500",
      };
    default:
      return {
        label: "Төлөвгүй",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "⏳",
        badgeColor: "bg-blue-500",
      };
  }
};

const CountingListPage: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const context = useContext(UserContext);

  if (!context) return null;

  const { userInfo } = context;

  const productContext = useContext(ProductContext);

  if (!productContext) return null;

  const { setCurrentCounting } = productContext;

  const [startDate, setStartDate] = useState<string>(
    threeMonthsAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    today.toISOString().split("T")[0]
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [countingList, setCountingList] = useState<CountingModel[]>([]);

  useEffect(() => {
    const fetchCountingLists = async () => {
      setIsLoading(true);

      if (userInfo?.dbase?.dbName) {
        try {
          const list = await getCountingList(
            userInfo.dbase.dbName,
            startDate,
            endDate
          );
          if (list) {
            setCountingList(list);
            console.log("Counting list:", list);
          }
        } catch (error) {
          console.error("Error fetching counting list:", error);
        }
      }

      setIsLoading(false);
    };

    fetchCountingLists();
  }, [startDate, endDate]);

  const handleCountingClick = (item: CountingModel) => {
    if (item.statusCode === "draft") {
      if (item.isEnabledPhoneApp) {
        setCurrentCounting(item);
        navigate(`/toollogo/${item.id}`, { state: { date: item.name } });
      } else {
        showToast.error("Тооллогыг утсаар тоолох үйлдлийг Хаасан байна!");
      }
    } else {
      showToast.error("Зөвхөн ноорог төлөвтэй тооллогыг нээх боломжтой!");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Тооллогын жагсаалт
          </h1>
        </div>

        {/* Filters */}
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-between pr-4">
              <div className="w-fit">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Эхлэх огноо :
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="w-fit">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дуусах огноо :
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : (
          <div className="space-y-2">
            {countingList.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">Тооллого олдсонгүй</p>
              </div>
            ) : (
              countingList.map((item) => {
                const isDraft =
                  item.statusCode == "draft"
                    ? "font-semibold bg-green-100"
                    : "text-gray-500 bg-gray-100";

                return (
                  <div key={item.id} onClick={() => handleCountingClick(item)}>
                    <div
                      className={`rounded-2xl overflow-hidden p-2 ${isDraft}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p>{item.name}</p>
                          <p>{item.statusText}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Тоолсон үнийн дүн :</span>
                        <span>{item.totalAmount.toLocaleString()}₮</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountingListPage;
