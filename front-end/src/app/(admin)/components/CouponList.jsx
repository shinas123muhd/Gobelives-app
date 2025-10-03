import React, { useState } from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdLockOpen, MdLock } from "react-icons/md";
import Select from "@/components/ui/Select";
import CouponListShimmer from "./CouponListShimmer";
import CreateCouponDrawer from "./CreateCouponDrawer";
import {
  useToggleCouponActive,
  useDeleteCoupon,
} from "@/app/(admin)/hooks/useCoupon";

const CouponList = ({
  coupons = [],
  pagination,
  isLoading = false,
  error,
  onPageChange,
  onRefresh,
}) => {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const toggleActiveMutation = useToggleCouponActive();
  const deleteCouponMutation = useDeleteCoupon();

  const handleEditClick = (coupon) => {
    // Transform coupon data to match form structure
    const editData = {
      _id: coupon._id, // Include the coupon ID for updates
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      discount: coupon.discount.toString(),
      discountType: coupon.discountType || "percentage",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      eligibility: coupon.eligibility,
      status: coupon.isActive,
      usageLimit: coupon.usageLimit || "",
      minimumAmount: coupon.minimumAmount || "",
      // Extract IDs from populated package objects
      selectedPackages:
        coupon.selectedPackages?.map((pkg) =>
          typeof pkg === "object" ? pkg._id : pkg
        ) || [],
      specificPackage:
        coupon.specificPackage && typeof coupon.specificPackage === "object"
          ? coupon.specificPackage._id
          : coupon.specificPackage || "",
    };

    setSelectedCoupon(editData);
    setIsEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setSelectedCoupon(null);
  };

  const handleStatusToggle = async (couponId) => {
    try {
      await toggleActiveMutation.mutateAsync(couponId);
      onRefresh?.(); // Refresh the data
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const handleDelete = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCouponMutation.mutateAsync(couponId);
        onRefresh?.(); // Refresh the data
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const eligibilityOptions = [
    { value: "all", label: "All" },
    { value: "selected", label: "Selected Packs" },
    { value: "specific", label: "Specific Packages" },
  ];

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-red-600 mb-4">
          Error loading coupons: {error.message}
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <CouponListShimmer count={5} />;
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100">
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
                DISCOUNT
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
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
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
                    {new Date(coupon.expiryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* DISCOUNT */}
                  <td className="px-6 py-2 text-sm font-medium text-gray-800">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discount}%`
                      : `${coupon.currency} ${coupon.discount}`}
                  </td>

                  {/* ELIGIBILITY */}
                  <td className="px-6 py-2">
                    <div className="w-40 relative ">
                      <Select
                        options={eligibilityOptions}
                        value={coupon.eligibility}
                        onChange={(value) => {
                          // TODO: Implement eligibility change
                          console.log(
                            "Change eligibility for coupon:",
                            coupon._id,
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
                      onClick={() => handleStatusToggle(coupon._id)}
                      disabled={toggleActiveMutation.isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        coupon.isActive ? "bg-green-600" : "bg-gray-200"
                      } ${
                        toggleActiveMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          coupon.isActive ? "translate-x-6" : "translate-x-1"
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
                        title={coupon.isActive ? "deactivate" : "activate"}
                        onClick={() => handleStatusToggle(coupon._id)}
                        disabled={toggleActiveMutation.isPending}
                        className={`p-2 cursor-pointer rounded-lg transition-colors ${
                          coupon.isActive
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-red-600 hover:text-red-700 hover:bg-red-50"
                        } ${
                          toggleActiveMutation.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {coupon.isActive ? (
                          <MdLockOpen className="text-lg" />
                        ) : (
                          <MdLock className="text-lg" />
                        )}
                      </button>
                      <button
                        title="delete"
                        onClick={() => handleDelete(coupon._id)}
                        disabled={deleteCouponMutation.isPending}
                        className={`p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                          deleteCouponMutation.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <IoTrashOutline className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Coupon Drawer */}
      <CreateCouponDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        editData={selectedCoupon}
        isEditMode={true}
        onSuccess={() => {
          handleCloseEditDrawer();
          onRefresh?.(); // Refresh the data after successful edit
        }}
      />
    </>
  );
};

export default CouponList;
