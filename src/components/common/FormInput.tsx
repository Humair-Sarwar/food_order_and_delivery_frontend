import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password" | "number" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  optionalText?: string;
  rows?: number; // Sirf textarea ke liye
  disabled?: boolean; // Added support for view-only/read-only layers
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  optionalText,
  rows = 2,
  disabled = false, // Default is false
}) => {
  // English: Updated focus rings and active borders to match the target orange branding workflow
  const inputClasses = `w-full px-4 py-2.5 text-sm border transition-all duration-200 rounded-xl focus:outline-none focus:ring-1 focus:bg-white ${
    disabled 
      ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed select-none" 
      : error 
        ? "bg-gray-50 border-rose-400 focus:border-rose-500 focus:ring-rose-100" 
        : "bg-gray-50 border-gray-200 focus:border-orange-400 focus:ring-orange-100"
  }`;

  return (
    <div className="w-full">
      {/* Dynamic Upper Label Nodes */}
      <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2 select-none">
        {label}{" "}
        {required && !disabled ? (
          <span className="text-rose-500">*</span>
        ) : (
          optionalText && !disabled && <span className="text-gray-400 font-medium lowercase">({optionalText})</span>
        )}
      </label>

      {/* Conditionally Render Textarea or Standard Inputs */}
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={disabled ? "" : placeholder}
          rows={rows}
          disabled={disabled}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={disabled ? "" : placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}

      {/* Error Engine Feedback */}
      {error && !disabled && (
        <p className="text-rose-500 text-xs mt-1.5 font-semibold flex items-center gap-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};