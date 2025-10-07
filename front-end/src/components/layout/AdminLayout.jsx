"use client";

import Sidebar from "@/app/(admin)/components/Sidebar";
import React, { useState, useEffect } from "react";
import { Public_Sans } from "next/font/google";
import Header from "@/app/(admin)/components/shared/Header";
import { useAuth } from "@/contexts/AuthContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize to close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <main
      className={`w-full h-screen overflow-hidden bg-white flex text-black ${publicSans.variable} font-sans`}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 w-full flex flex-col h-full bg-gray-50 overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />
        {children}
      </div>
    </main>
  );
};

export default AdminLayout;
