"use client";
import CouponFilter from "@/app/(admin)/components/CouponFilter";
import CouponList from "@/app/(admin)/components/CouponList";

const Coupons = () => {
  return (
    <section className="w-full h-full px-6 pb-6">
      {/* Filter Section */}
      <CouponFilter />

      {/* Coupons Table */}
      <CouponList />
    </section>
  );
};

export default Coupons;
