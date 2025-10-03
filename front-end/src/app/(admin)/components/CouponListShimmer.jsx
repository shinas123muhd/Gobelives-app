import React from "react";

const CouponRowShimmer = () => {
  return (
    <tr className="animate-pulse">
      {/* CODE */}
      <td className="px-6 py-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>

      {/* COUPON NAME */}
      <td className="px-6 py-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>

      {/* EXPIRY DATE */}
      <td className="px-6 py-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>

      {/* DISCOUNT % */}
      <td className="px-6 py-2">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>

      {/* ELIGIBILITY */}
      <td className="px-6 py-2">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </td>

      {/* STATUS */}
      <td className="px-6 py-2">
        <div className="h-6 bg-gray-200 rounded-full w-11"></div>
      </td>

      {/* ACTION */}
      <td className="px-6 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </td>
    </tr>
  );
};

const CouponListShimmer = ({ count = 5 }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              CODE
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              COUPON NAME
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              EXPIRY DATE
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              DISCOUNT %
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              ELIGIBILITY
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              STATUS
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              ACTION
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {[...Array(count)].map((_, index) => (
            <CouponRowShimmer key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponListShimmer;
