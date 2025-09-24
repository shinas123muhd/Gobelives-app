"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
import { getTitleByPath } from "../../constants/routes";

const Header = () => {
  const pathname = usePathname();
  const title = getTitleByPath(pathname);

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
        <div className="w-[38px] h-[39px] rounded-full relative bg-gray-600 ">
          <div
            className="w-4 h-4 bg-white flex items-center
      justify-center rounded-full absolute -bottom-[2px] -right-[2px]"
          >
            <div className="w-[10px] h-[10px] bg-[#28C76F] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
