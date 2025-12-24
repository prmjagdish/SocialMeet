import React from "react";

function InputField({
  label,
  showLabel = false,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  maxLength,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <label htmlFor={id} className="block text-xs font-medium text-gray-900">
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm rounded-md border outline-none placeholder-gray-400 bg-white
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-300"
              : "border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-300"
          }
        `}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default InputField;
