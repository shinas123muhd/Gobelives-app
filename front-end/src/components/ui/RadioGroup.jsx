import React from "react";

const RadioGroup = ({
  name,
  options = [],
  value,
  onChange,
  className = "",
  disabled = false,
  error = false,
  label = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center space-x-2 cursor-pointer
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange && onChange(e)}
              disabled={disabled}
              className={`
                h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300
                ${error ? "border-red-300" : ""}
              `}
              {...props}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && typeof error === "string" && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;
