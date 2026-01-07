import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { getCountingList } from "@/api/services";

interface Transaction {
  id: string;
  date: string; // ISO string
  location: string;
  type: string;
  amount: number;
}

const sampleData: Transaction[] = [
  {
    id: "1",
    date: "2026-01-05",
    location: "Ulaanbaatar",
    type: "Income",
    amount: 5000,
  },
  {
    id: "2",
    date: "2026-01-06",
    location: "Darkhan",
    type: "Expense",
    amount: 2000,
  },
  {
    id: "3",
    date: "2026-01-04",
    location: "Erdenet",
    type: "Income",
    amount: 10000,
  },
  {
    id: "4",
    date: "2026-01-06",
    location: "Ulaanbaatar",
    type: "Expense",
    amount: 3500,
  },
];

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

  const filteredData = useMemo(() => {
    return sampleData.filter((t) => {
      const txDate = new Date(t.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      if (from && txDate < from) return false;
      if (to && txDate > to) return false;

      return true;
    });
  }, [startDate, endDate]);

  useEffect(() => {
    getCountingList(startDate, endDate);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Тооллого</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredData.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {format(new Date(tx.date), "yyyy-MM-dd")}
                  </td>
                  <td className="px-6 py-4">{tx.location}</td>
                  <td className="px-6 py-4">{tx.type}</td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToollogoPage;
