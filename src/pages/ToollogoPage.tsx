// import React, { useState, useMemo, useEffect } from "react";
// import { format } from "date-fns";
// import { getCountingList } from "@/api/services";

// interface Transaction {
//   id: string;
//   date: string; // ISO string
//   location: string;
//   type: string;
//   amount: number;
// }

// const sampleData: Transaction[] = [
//   {
//     id: "1",
//     date: "2026-01-05",
//     location: "Ulaanbaatar",
//     type: "Income",
//     amount: 5000,
//   },
//   {
//     id: "2",
//     date: "2026-01-06",
//     location: "Darkhan",
//     type: "Expense",
//     amount: 2000,
//   },
//   {
//     id: "3",
//     date: "2026-01-04",
//     location: "Erdenet",
//     type: "Income",
//     amount: 10000,
//   },
//   {
//     id: "4",
//     date: "2026-01-06",
//     location: "Ulaanbaatar",
//     type: "Expense",
//     amount: 3500,
//   },
// ];

// const ToollogoPage: React.FC = () => {
//   const today = new Date();
//   const threeMonthsAgo = new Date();
//   threeMonthsAgo.setMonth(today.getMonth() - 3);
//   const [startDate, setStartDate] = useState<string>(
//     threeMonthsAgo.toISOString().split("T")[0]
//   );

//   const [endDate, setEndDate] = useState<string>(
//     today.toISOString().split("T")[0]
//   );

//   const filteredData = useMemo(() => {
//     return sampleData.filter((t) => {
//       const txDate = new Date(t.date);
//       const from = startDate ? new Date(startDate) : null;
//       const to = endDate ? new Date(endDate) : null;

//       if (from && txDate < from) return false;
//       if (to && txDate > to) return false;

//       return true;
//     });
//   }, [startDate, endDate]);

//   useEffect(() => {
//     getCountingList(startDate, endDate);
//   }, []);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Тооллого</h1>

//       <div className="mb-6 flex flex-wrap items-center gap-4">
//         <div>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <table className="min-w-full bg-white divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left">Date</th>
//               <th className="px-6 py-3 text-left">Location</th>
//               <th className="px-6 py-3 text-left">Type</th>
//               <th className="px-6 py-3 text-right">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="text-center py-4 text-gray-500">
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               filteredData.map((tx) => (
//                 <tr key={tx.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     {format(new Date(tx.date), "yyyy-MM-dd")}
//                   </td>
//                   <td className="px-6 py-4">{tx.location}</td>
//                   <td className="px-6 py-4">{tx.type}</td>
//                   <td className="px-6 py-4 text-right font-semibold">
//                     {tx.amount.toLocaleString()}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ToollogoPage;
import React, { useState, useMemo } from "react";

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
  shopName: string;
  type: "батлагдсан" | "ноорог" | "илгээсэн";
  totalAmount: number;
}

const sampleData: InventoryCount[] = [
  {
    id: "CNT001",
    date: "2026-01-05",
    shopName: "Нархан дэлгүүр",
    type: "батлагдсан",
    totalAmount: 5420,
  },
  {
    id: "CNT002",
    date: "2026-01-06",
    shopName: "Их Тойруу",
    type: "ноорог",
    totalAmount: 8320,
  },
  {
    id: "CNT003",
    date: "2026-01-04",
    shopName: "Сансар",
    type: "илгээсэн",
    totalAmount: 12450,
  },
  {
    id: "CNT004",
    date: "2026-01-06",
    shopName: "Төв дэлгүүр",
    type: "батлагдсан",
    totalAmount: 6780,
  },
  {
    id: "CNT005",
    date: "2026-01-07",
    shopName: "Нархан дэлгүүр",
    type: "ноорог",
    totalAmount: 4590,
  },
];

const getTypeConfig = (type: InventoryCount["type"]) => {
  switch (type) {
    case "батлагдсан":
      return {
        label: "Батлагдсан",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "✓",
        badgeColor: "bg-green-500",
      };
    case "ноорог":
      return {
        label: "Ноорог",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: "⏳",
        badgeColor: "bg-yellow-500",
      };
    case "илгээсэн":
      return {
        label: "Илгээсэн",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "📤",
        badgeColor: "bg-blue-500",
      };
  }
};

const ToollogoPage: React.FC = () => {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const [startDate, setStartDate] = useState<string>(
    threeMonthsAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [filterType, setFilterType] = useState<string>("all");

  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      const itemDate = new Date(item.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      if (from && itemDate < from) return false;
      if (to && itemDate > to) return false;
      if (filterType !== "all" && item.type !== filterType) return false;

      return true;
    });
  }, [startDate, endDate, filterType]);

  const stats = useMemo(() => {
    return {
      батлагдсан: filteredData.filter((i) => i.type === "батлагдсан").length,
      ноорог: filteredData.filter((i) => i.type === "ноорог").length,
      илгээсэн: filteredData.filter((i) => i.type === "илгээсэн").length,
      total: filteredData.length,
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            📋 Тооллогын жагсаалт
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Барааны тооллогын түүх болон статистик
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
                <button
                  onClick={() => setFilterType("илгээсэн")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === "илгээсэн"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  📤 Илгээсэн ({stats.илгээсэн})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
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
                        {item.shopName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(item.date)}
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

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Огноо
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Дэлгүүрийн нэр
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Төлөв
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Нийт тоо ширхэг
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-gray-500">Тооллого олдсонгүй</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const config = getTypeConfig(item.type);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {item.shopName}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
                          >
                            <span>{config.icon}</span>
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-bold text-gray-800">
                            {item.totalAmount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToollogoPage;
