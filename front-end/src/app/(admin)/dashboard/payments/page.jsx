"use client";
import React from "react";
import PaymentFilter from "@/app/(admin)/components/PaymentFilter";
import PaymentTable from "@/app/(admin)/components/PaymentTable";
import PaymentPagination from "@/app/(admin)/components/PaymentPagination";

const PaymentDetails = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <PaymentFilter />

      {/* Payment Table Section */}
      <PaymentTable />

      {/* Pagination Section */}
      <PaymentPagination />
    </section>
  );
};

export default PaymentDetails;
