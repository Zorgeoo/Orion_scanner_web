import { getCountingList } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { CountingModel } from "@/types/CountingModel";
import React, { useState, useMemo, useEffect, useContext } from "react";

// Simple date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface InventoryCount {
  id: string;
  date: string;
  typeName: string;
  type: string;
  totalAmount: number;
}

// Convert CountingModel to InventoryCount
const convertToInventoryCount = (model: CountingModel): InventoryCount => {
  const [id, date, typeName, type, totalAmount] = model;
  return {
    id,
    date,
    typeName,
    type,
    totalAmount,
  };
};

const getTypeConfig = (type: InventoryCount["type"]) => {
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

const ToollogoPage: React.FC = () => {
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
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [countingList, setCountingList] = useState<CountingModel[]>([]);

  // Convert CountingModel array to InventoryCount array
  const inventoryData = useMemo(() => {
    return countingList.map(convertToInventoryCount);
  }, [countingList]);

  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const itemDate = new Date(item.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      if (filterType !== "all" && item.type !== filterType) return false;

      return true;
    });
  }, [inventoryData, startDate, endDate, filterType]);

  const stats = useMemo(() => {
    return {
      батлагдсан: filteredData.filter((i) => i.type === "батлагдсан").length,
      ноорог: filteredData.filter((i) => i.type === "ноорог").length,
      total: filteredData.length,
    };
  }, [filteredData]);

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
  }, [userInfo, startDate, endDate]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            📋 Тооллогын жагсаалт
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {userInfo?.dbase?.companyName || "Байгууллага"}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Эхлэх огноо
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дуусах огноо
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Төлөв
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "all"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  Бүгд ({stats.total})
                </button>
                <button
                  onClick={() => setFilterType("батлагдсан")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "батлагдсан"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  ✓ Батлагдсан ({stats.батлагдсан})
                </button>
                <button
                  onClick={() => setFilterType("ноорог")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "ноорог"
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  ⏳ Ноорог ({stats.ноорог})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Ачааллаж байна...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">Тооллого олдсонгүй</p>
              </div>
            ) : (
              filteredData.map((item) => {
                const config = getTypeConfig(item.type);
                return (
                  <div
                    key={item.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{item.id}</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {item.date}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.typeName}
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
                        Нийт тоо ширхэг
                      </span>
                      <span className="text-xl font-bold text-gray-800">
                        {item.totalAmount.toLocaleString()}
                      </span>
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

export default ToollogoPage;
