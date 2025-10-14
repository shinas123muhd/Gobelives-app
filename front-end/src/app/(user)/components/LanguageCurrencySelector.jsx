"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const LanguageCurrencySelector = () => {
  const [language, setLanguage] = useState("English (UK)");
  const [currency, setCurrency] = useState("U.S. Dollar ($)");

  return (
    <div className=" text-white  rounded-2xl w-full max-w-sm mx-auto space-y-6">
      {/* Language */}
      <div>
        <label className="block font-bold  text-white/80 mb-2">Language</label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full appearance-none bg-transparent border border-gray-700 rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-gray-400 cursor-pointer transition-colors duration-200"
          >
            <option className="bg-[#0B1E1E]">English (UK)</option>
            <option className="bg-[#0B1E1E]">English (US)</option>
            <option className="bg-[#0B1E1E]">Deutsch</option>
            <option className="bg-[#0B1E1E]">Español</option>
          </select>

          {/* Flag */}
          {/* <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Image
              src="https://flagcdn.com/w20/gb.png"
              alt="UK Flag"
              width={20}
              height={14}
              className="rounded-sm"
            />
          </div> */}

          {/* Chevron */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Currency</label>
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full appearance-none bg-transparent border border-gray-700 rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-gray-400 cursor-pointer transition-colors duration-200"
          >
            <option className="bg-[#0B1E1E]">U.S. Dollar ($)</option>
            <option className="bg-[#0B1E1E]">Euro (€)</option>
            <option className="bg-[#0B1E1E]">Pound (£)</option>
            <option className="bg-[#0B1E1E]">Indian Rupee (₹)</option>
          </select>

          {/* Chevron */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCurrencySelector;
