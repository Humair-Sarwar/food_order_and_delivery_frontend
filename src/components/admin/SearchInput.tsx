import React from "react";
import { Search, type LucideIcon } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  wrapperClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeValue,
  placeholder = "Search...",
  icon: Icon = Search, // Default to Lucide Search icon
  wrapperClassName = "relative flex-1 max-w-md w-full",
  className = "",
  ...props
}) => {
  return (
    <div className={wrapperClassName}>
      <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 pl-10 pr-4 text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700 placeholder-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};