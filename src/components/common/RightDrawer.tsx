import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const RightDrawer: React.FC<RightDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md"
}) => {
  // جب ماڈل اوپن ہو تو بیک گراؤنڈ اسکرول کو لاک کرنے کے لیے
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // سائز کنٹرول کرنے کے لیے وڈتھ میپنگ
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative w-full ${sizeClasses[size]} bg-white shadow-2xl flex flex-col h-full border-l border-gray-100`}
          >
            {/* Header section */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs font-medium text-gray-400 mt-0.5 tracking-wide">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-150 text-gray-400 hover:text-gray-600 hover:bg-gray-50 bg-white shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Content section */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {children}
            </div>

            {/* Optional Footer section */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RightDrawer;