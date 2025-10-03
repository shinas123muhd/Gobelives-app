"use client";
import React from "react";
import UserFilter from "@/app/(admin)/components/UserFilter";
import UserTable from "@/app/(admin)/components/UserTable";
import UserPagination from "@/app/(admin)/components/UserPagination";

const Users = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <UserFilter />

      {/* Table Section */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <UserTable />
        <UserPagination />
      </div>
    </section>
  );
};

export default Users;
