"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ 
    type = "text", 
    label,
    placeholder, 
    value, 
    onChange, 
    showPasswordToggle = false,
    icon = null,
    ...props 
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
  
    const inputType = showPasswordToggle && showPassword ? "text" : type;
  
    return (
      <div className="relative mb-4">
         {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {label}
        </label>
      )}
        <div className={`relative flex items-center bg-[#FFFFFF1F] rounded-full border-b  transition-colors duration-200 ${
          isFocused ? 'border-yellow-400' : 'border-gray-200'
        }`}>
          {icon && (
            <div className="pl-3 pr-2">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 px-3 py-3 bg-transparent  text-[#C4CDCA]  focus:outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  export default InputField;