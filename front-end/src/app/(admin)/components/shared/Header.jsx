"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "../../../../contexts/AuthContext";
import { getTitleByPath } from "../../constants/routes";

const Header = () => {
  const pathname = usePathname();
  const title = getTitleByPath(pathname);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className="w-full flex items-center px-6 pt-6 justify-between">
      <h3 className="font-semibold text-xl text-[#23272E]">{title}</h3>
      <div className="flex items-center gap-x-5 justify-end">
        <div className="relative">
          <IoIosNotificationsOutline className="text-3xl text-[#4B465C]" />
          <span
            className="text-xs absolute flex items-center justify-center font-medium text-white
       bg-[#EA5455] aspect-square w-[18px] h-[18px] rounded-full -top-1 -right-1"
          >
            4
          </span>
        </div>
        <div className="relative">
          <div
            className="w-[38px] h-[39px] rounded-full relative bg-gray-600 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div
              className="w-4 h-4 bg-white flex items-center
        justify-center rounded-full absolute -bottom-[2px] -right-[2px]"
            >
              <div className="w-[10px] h-[10px] bg-[#28C76F] rounded-full"></div>
            </div>
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@gobelives.com"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <IoMdLogOut className="text-base" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
