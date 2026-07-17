import React, { type ButtonHTMLAttributes } from "react";
import { Plus } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string; 
  showIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label = "Upload Media Assets",
  showIcon = true,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 px-4 h-10 text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 transition-all active:scale-98 cursor-pointer self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {showIcon && <Plus className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};

export default Button;