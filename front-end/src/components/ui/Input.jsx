import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type = "text",
      placeholder = "",
      value,
      onChange,
      className = "",
      disabled = false,
      error = false,
      label = "",
      required = false,
      ...props
    },
    ref
  ) => {
    // Ensure we always have a defined value to prevent controlled/uncontrolled issues
    const inputValue = value !== undefined ? value : "";
    const hasOnChange = onChange && typeof onChange === "function";
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...(hasOnChange
            ? { value: inputValue, onChange }
            : { defaultValue: inputValue })}
          disabled={disabled}
          className={`
          w-full px-3 py-2 text-sm border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
          ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          ${className}
        `}
          {...props}
        />
        {error && typeof error === "string" && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
