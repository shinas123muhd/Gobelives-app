import React, { forwardRef } from "react";

const Textarea = forwardRef(
  (
    {
      placeholder = "",
      value,
      onChange,
      className = "",
      disabled = false,
      error = false,
      label = "",
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={`
          w-full px-3 py-2 text-sm border rounded-lg resize-none
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

Textarea.displayName = "Textarea";

export default Textarea;
