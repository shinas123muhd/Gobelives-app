import React, { useState } from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdLockOpen, MdLock } from "react-icons/md";
import Select from "@/components/ui/Select";

// Mock coupon data
const coupons = [
  {
    id: 1,
    code: "WELCOME10",
    name: "First Booking",
    expiryDate: "31 Dec, 2025",
    discount: "10%",
    eligibility: "All",
    status: true,
  },
  {
    id: 2,
    code: "GROUPTRIP",
    name: "Group 4+",
    expiryDate: "15 Jan, 2026",
    discount: "15%",
    eligibility: "Selected Packs",
    status: false,
  },
  {
    id: 3,
    code: "EARLYBIRD15",
    name: "Early Booking",
    expiryDate: "28 Feb, 2026",
    discount: "5%",
    eligibility: "All",
    status: true,
  },
];

const CouponList = () => {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponsList, setCouponsList] = useState(coupons);

  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setSelectedCoupon(null);
  };

  const handleStatusToggle = (couponId) => {
    setCouponsList((prevCoupons) =>
      prevCoupons.map((coupon) =>
        coupon.id === couponId ? { ...coupon, status: !coupon.status } : coupon
      )
    );
  };

  const handleDelete = (couponId) => {
    // TODO: Implement delete functionality
    console.log("Delete coupon:", couponId);
  };

  const eligibilityOptions = [
    { value: "all", label: "All" },
    { value: "selected", label: "Selected Packs" },
    { value: "specific", label: "Specific Packages" },
  ];

  return (
    <>
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
            {couponsList.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                {/* CODE */}
                <td className="px-6 py-2 text-sm font-medium text-gray-800">
                  {coupon.code}
                </td>

                {/* COUPON NAME */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {coupon.name}
                </td>

                {/* EXPIRY DATE */}
                <td className="px-6 py-2 text-sm text-gray-600">
                  {coupon.expiryDate}
                </td>

                {/* DISCOUNT % */}
                <td className="px-6 py-2 text-sm font-medium text-gray-800">
                  {coupon.discount}
                </td>

                {/* ELIGIBILITY */}
                <td className="px-6 py-2">
                  <div className="w-32">
                    <Select
                      options={eligibilityOptions}
                      value={coupon.eligibility.toLowerCase()}
                      onChange={(value) => {
                        // TODO: Implement eligibility change
                        console.log(
                          "Change eligibility for coupon:",
                          coupon.id,
                          value
                        );
                      }}
                      placeholder={coupon.eligibility}
                      className="text-xs"
                    />
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-6 py-2">
                  <button
                    onClick={() => handleStatusToggle(coupon.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      coupon.status ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        coupon.status ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                {/* ACTION */}
                <td className="px-6 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      title="edit"
                      onClick={() => handleEditClick(coupon)}
                      className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit className="text-lg" />
                    </button>
                    <button
                      title={coupon.status ? "unlock" : "lock"}
                      onClick={() => handleStatusToggle(coupon.id)}
                      className={`p-2 cursor-pointer rounded-lg transition-colors ${
                        coupon.status
                          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                          : "text-red-600 hover:text-red-700 hover:bg-red-50"
                      }`}
                    >
                      {coupon.status ? (
                        <MdLockOpen className="text-lg" />
                      ) : (
                        <MdLock className="text-lg" />
                      )}
                    </button>
                    <button
                      title="delete"
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Coupon Drawer - TODO: Implement this component */}
      {/* <EditCouponDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        coupon={selectedCoupon}
      /> */}
    </>
  );
};

export default CouponList;
