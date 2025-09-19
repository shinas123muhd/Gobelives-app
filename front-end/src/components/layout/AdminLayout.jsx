import Sidebar from "@/app/(admin)/components/Sidebar";
import React from "react";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const AdminLayout = ({ children }) => {
  return (
    <main
      className={`w-full h-screen overflow-hidden bg-white flex text-black ${publicSans.variable} font-sans`}
    >
      <Sidebar />
      <div className="flex-1 w-full h-full overflow-hidden">{children}</div>
    </main>
  );
};

export default AdminLayout;
