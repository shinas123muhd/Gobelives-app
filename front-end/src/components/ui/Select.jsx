import React, { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

const Select = ({
  options = [],
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
  disabled = false,
  label = "",
  required = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync selectedValue with external value prop
  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
          w-full flex whitespace-nowrap items-center justify-between px-3 py-2 text-sm
          bg-white border rounded-lg
          hover:border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "ring-2" : ""}
          ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-200 focus:ring-blue-500"
          }
          ${isOpen && !error ? "border-blue-500 ring-blue-500" : ""}
          ${isOpen && error ? "border-red-500 ring-red-500" : ""}
        `}
        >
          <span
            className={`${selectedOption ? "text-gray-900" : "text-gray-500"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <IoChevronDownOutline
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                transition-colors duration-150
                ${
                  selectedValue === option.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-900"
                }
              `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && typeof error === "string" && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
