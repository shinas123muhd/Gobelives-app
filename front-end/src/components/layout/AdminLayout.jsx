"use client";

import Sidebar from "@/app/(admin)/components/Sidebar";
import React from "react";
import { Public_Sans } from "next/font/google";
import Header from "@/app/(admin)/components/shared/Header";
import { useAuth } from "@/contexts/AuthContext";

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
      <div className="flex-1 w-full flex flex-col h-full bg-gray-50 overflow-hidden">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default AdminLayout;
