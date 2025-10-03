import React, { forwardRef } from "react";

const Checkbox = forwardRef(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label = "",
      className = "",
      error = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
            ${error ? "border-red-300" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          {...props}
        />
        {label && (
          <label
            className={`
            text-sm text-gray-700 cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
