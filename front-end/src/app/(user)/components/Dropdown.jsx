"use client"
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Dropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" text-[#C4CDCA] w-full px-4 py-3 rounded-md flex items-center gap-2 hover:bg-gray-700 transition-colors min-w-[140px] justify-between"
        >
          <span className="">{value || label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 min-w-full">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

export default Dropdown