"use client";
import React from "react";
import PackageFilter from "@/app/(admin)/components/PackageFilter";
import PackageList from "@/app/(admin)/components/PackageList";

const Packages = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <PackageFilter />

      {/* Packages Grid */}
      <PackageList />
    </section>
  );
};

export default Packages;
