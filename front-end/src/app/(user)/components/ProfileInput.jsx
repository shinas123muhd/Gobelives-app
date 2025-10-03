import React, { useState } from 'react'

const ProfileInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? 'text' : type

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className={`flex items-center rounded-sm  bg-white/5 transition-colors ${
        error ? 'border border-red-500/70' : '  focus-within:border-yellow-400'
      }`}>
        <input
          type={inputType}
          className="w-full bg-transparent text-white placeholder-white/50 px-4 py-3 outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white px-3"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default ProfileInput



