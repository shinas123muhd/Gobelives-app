"use client";
import { useState } from "react";
import CouponFilter from "@/app/(admin)/components/CouponFilter";
import CouponList from "@/app/(admin)/components/CouponList";
import { useCoupons } from "@/app/(admin)/hooks/useCoupon";

const Coupons = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
    status: "",
    eligibility: "",
    isActive: undefined,
    isFeatured: undefined,
    createdBy: "",
    expiryDateFrom: "",
    expiryDateTo: "",
  });

  const { data: couponsData, isLoading, error, refetch } = useCoupons(filters);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleCouponCreated = () => {
    // Refresh the coupons data when a new coupon is created
    refetch();
  };

  return (
    <section className="w-full h-full px-6 pb-6">
      {/* Filter Section */}
      <CouponFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onCouponCreated={handleCouponCreated}
      />

      {/* Coupons Table */}
      <CouponList
        coupons={couponsData?.coupons || []}
        pagination={couponsData?.pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePageChange}
        onRefresh={refetch}
      />
    </section>
  );
};

export default Coupons;
