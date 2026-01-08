import { getCountingList } from "@/api/services";
import ListSkeleton from "@/components/common/ListSkeleton";
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            📋 Тооллогын жагсаалт
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg mb-6">
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
          <div className="space-y-4">
            {countingList.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">Тооллого олдсонгүй</p>
              </div>
            ) : (
              countingList.map((item) => {
                const config = getTypeConfig(item.statusCode);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCountingClick(item)}
                    className="cursor-pointer"
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                      {/* Card content */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.id}
                          </p>
                          <p className="font-bold text-gray-800 text-lg">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.statusText}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
                        >
                          <span>{config.icon}</span>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          Нийт дүн :
                        </span>
                        <span className="text-xl font-bold text-gray-800">
                          {item.totalAmount.toLocaleString()}₮
                        </span>
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
