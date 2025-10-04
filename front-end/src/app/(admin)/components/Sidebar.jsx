"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SIDEBAR_ITEMS, ADMIN_SECTION_ITEMS } from "../constant";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState({
    "manage-destinations": true,
    "seo-tools": false,
  });

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };

  const isActive = (path) => {
    if (!path) return false;

    // For exact matches
    if (pathname === path) return true;

    // For nested routes, only match if we're on a sub-route AND the path is not just "/dashboard"
    // This prevents /dashboard from matching /dashboard/destinations/packages
    if (pathname.startsWith(path + "/")) {
      // Special case: don't match /dashboard for any sub-routes
      if (path === "/dashboard") {
        return false;
      }
      // For other paths, allow matching sub-routes
      return true;
    }

    return false;
  };

  const isParentActive = (item) => {
    if (!item.hasSubItems) return false;
    return item.subItems.some((subItem) => isActive(subItem.path));
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isItemActive = isActive(item.path);
    const isParentActiveItem = isParentActive(item);
    const isExpanded = expandedItems[item.id];

    return (
      <div key={item.id}>
        <div
          className={`flex items-center rounded-lg justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${
            isItemActive
              ? "bg-white text-[#2B4B40] shadow-sm border-l-4 border-yellow-400"
              : isParentActiveItem
              ? "bg-white/20 text-white border-l-4 border-white/30"
              : "text-[#C4CDCA] hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => {
            if (item.hasSubItems) {
              toggleExpanded(item.id);
            } else {
              handleNavigation(item.path);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <Icon
              size={20}
              className={`transition-colors duration-200 ${
                isItemActive
                  ? "text-[#2B4B40]"
                  : isParentActiveItem
                  ? "text-white"
                  : "text-[#C4CDCA]"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isItemActive
                  ? "text-[#2B4B40] font-semibold"
                  : isParentActiveItem
                  ? "text-white font-medium"
                  : "text-[#C4CDCA]"
              }`}
            >
              {item.title}
            </span>
          </div>
          {item.hasSubItems && (
            <div
              className={`text-lg transition-colors duration-200 ${
                isItemActive
                  ? "text-[#2B4B40]"
                  : isParentActiveItem
                  ? "text-white"
                  : "text-[#C4CDCA]"
              }`}
            >
              {isExpanded ? (
                <MdOutlineKeyboardArrowDown />
              ) : (
                <MdKeyboardArrowRight />
              )}
            </div>
          )}
        </div>

        {item.hasSubItems && isExpanded && (
          <div className="ml-4 mt-1">
            {item.subItems.map((subItem) => {
              const isSubItemActive = isActive(subItem.path);
              return (
                <div
                  key={subItem.id}
                  className={`px-4 py-2.5 cursor-pointer rounded-lg transition-all duration-200 ${
                    isSubItemActive
                      ? "bg-white text-[#003F38] shadow-sm border-l-4 border-yellow-400 font-medium"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  } ${
                    subItem.isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    !subItem.isDisabled && handleNavigation(subItem.path)
                  }
                >
                  <span
                    className={`text-sm transition-all duration-200 ${
                      isSubItemActive ? "font-medium" : "font-normal"
                    }`}
                  >
                    {subItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-[#2B4B40] h-full overflow-hidden px-2 min-w-[240px] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4  ">
        <h1 className="text-2xl font-bold text-yellow-400">Gobelives</h1>
      </div>
      <div className="px-4 pt-2 pb-4  sticky top-0 bg-[#2B4B40]">
        <h2 className="text-xs font-medium text-white/70 uppercase tracking-wider">
          MAIN MENU
        </h2>
      </div>
      {/* Main Menu Section */}
      <div className="flex-1 h-full overflow-y-auto  custom-scrollbar">
        <div className="space-y-1 ">{SIDEBAR_ITEMS.map(renderMenuItem)}</div>
      </div>

      {/* Admin Section */}
      <div className="px-4 border-t border-white/20 pt-3 mt-4">
        <h2 className="text-xs font-medium text-white/70 uppercase tracking-wider">
          ADMIN
        </h2>
      </div>
      <div className=" py-2 ">
        <div className="space-y-1">
          {ADMIN_SECTION_ITEMS.map(renderMenuItem)}
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
