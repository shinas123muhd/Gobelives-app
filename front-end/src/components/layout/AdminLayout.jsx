import Sidebar from "@/app/(admin)/components/Sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <main className="w-full h-screen overflow-hidden bg-white flex text-black">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-[#e8fbf9] p-5">{children}</div>
    </main>
  );
};

export default AdminLayout;
