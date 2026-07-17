import React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  onChangeValue: (value: string) => void;
  options: SelectOption[];
  wrapperClassName?: string;
  setPage?: (page: number) => void;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChangeValue,
  options,
  wrapperClassName = "flex items-center gap-2 self-end sm:self-auto",
  className = "",
  setPage,
  ...props
}) => {
  return (
    <div className={wrapperClassName}>
      <select
        value={value}
        onChange={(e) => {
            onChangeValue(e.target.value)
            if (setPage) {
            setPage(1);
          }
        }}
        className={`h-10 px-3 text-xs font-bold bg-white border border-gray-200 rounded-xl text-gray-600 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 cursor-pointer transition-all ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};