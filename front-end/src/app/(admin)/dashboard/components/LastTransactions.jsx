"use client";
import React from "react";

const LastTransactions = () => {
  // Sample transaction data
  const transactions = [
    { id: "#5089", issuedDate: "31 March 2025", total: "240 $" },
    { id: "#5090", issuedDate: "01 April 2025", total: "150 $" },
    { id: "#5091", issuedDate: "02 April 2025", total: "320 $" },
    { id: "#5092", issuedDate: "03 April 2025", total: "180 $" },
    { id: "#5093", issuedDate: "04 April 2025", total: "290 $" },
    { id: "#5094", issuedDate: "05 April 2025", total: "210 $" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Last Transactions
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issued Date
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {transaction.id}
                </td>
                <td className="py-3 px-2 text-sm text-gray-600">
                  {transaction.issuedDate}
                </td>
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {transaction.total}
                </td>
                <td className="py-3 px-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    View Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastTransactions;
