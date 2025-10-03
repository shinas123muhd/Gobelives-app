import React, { useState } from "react";
import { FiEye, FiDownload } from "react-icons/fi";
import { IoRefreshOutline } from "react-icons/io5";

// Mock transaction data
const transactions = [
  {
    id: 1,
    transactionId: "TXN001",
    customer: "John Doe",
    package: "Beach Paradise",
    amount: 250.0,
    status: "completed",
    type: "booking",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    transactionId: "TXN002",
    customer: "Jane Smith",
    package: "Mountain Adventure",
    amount: 180.0,
    status: "pending",
    type: "booking",
    date: "2024-01-14",
    paymentMethod: "PayPal",
  },
  {
    id: 3,
    transactionId: "TXN003",
    customer: "Mike Johnson",
    package: "City Explorer",
    amount: 120.0,
    status: "failed",
    type: "booking",
    date: "2024-01-13",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    transactionId: "TXN004",
    customer: "Sarah Wilson",
    package: "Beach Paradise",
    amount: 250.0,
    status: "refunded",
    type: "refund",
    date: "2024-01-12",
    paymentMethod: "Credit Card",
  },
  {
    id: 5,
    transactionId: "TXN005",
    customer: "David Brown",
    package: "Mountain Adventure",
    amount: 25.0,
    status: "completed",
    type: "commission",
    date: "2024-01-11",
    paymentMethod: "Internal",
  },
];

const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  const handleViewDetails = (transactionId) => {
    // TODO: Implement view details functionality
    console.log("View details for transaction:", transactionId);
  };

  const handleDownloadReceipt = (transactionId) => {
    // TODO: Implement download receipt functionality
    console.log("Download receipt for transaction:", transactionId);
  };

  const handleRefresh = (transactionId) => {
    // TODO: Implement refresh/retry functionality
    console.log("Refresh transaction:", transactionId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-purple-100 text-purple-800";
      case "refund":
        return "bg-orange-100 text-orange-800";
      case "commission":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstTransaction + 1} to{" "}
          {Math.min(indexOfLastTransaction, transactions.length)} of{" "}
          {transactions.length} transactions
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 text-sm border rounded-md ${
                currentPage === number
                  ? "bg-[#1D332C] text-white border-[#1D332C]"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                TRANSACTION ID
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                CUSTOMER
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                PACKAGE
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                AMOUNT
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                STATUS
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                TYPE
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                DATE
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                PAYMENT METHOD
              </th>
              <th className="px-6 py-2 text-left text-sm font-medium text-gray-600">
                ACTION
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                {/* TRANSACTION ID */}
                <td className="px-6 py-2 text-sm font-medium text-gray-800">
                  {transaction.transactionId}
                </td>

                {/* CUSTOMER */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {transaction.customer}
                </td>

                {/* PACKAGE */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {transaction.package}
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-2 text-sm font-medium text-gray-800">
                  ${transaction.amount.toFixed(2)}
                </td>

                {/* STATUS */}
                <td className="px-6 py-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </td>

                {/* TYPE */}
                <td className="px-6 py-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                </td>

                {/* DATE */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>

                {/* PAYMENT METHOD */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {transaction.paymentMethod}
                </td>

                {/* ACTION */}
                <td className="px-6 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      title="View Details"
                      onClick={() =>
                        handleViewDetails(transaction.transactionId)
                      }
                      className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEye className="text-lg" />
                    </button>
                    <button
                      title="Download Receipt"
                      onClick={() =>
                        handleDownloadReceipt(transaction.transactionId)
                      }
                      className="p-2 text-gray-400 cursor-pointer hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FiDownload className="text-lg" />
                    </button>
                    {transaction.status === "failed" && (
                      <button
                        title="Retry Transaction"
                        onClick={() => handleRefresh(transaction.transactionId)}
                        className="p-2 text-gray-400 cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <IoRefreshOutline className="text-lg" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </>
  );
};

export default TransactionList;
