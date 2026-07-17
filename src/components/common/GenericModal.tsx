import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // Optional prop dynamic width ke liye (e.g., 'max-w-5xl', 'max-w-md')
}

export const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl", // Agar prop nahi aayega to default yahi rahega
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content Wrapper - MaxWidth dynamic inject ho gaya */}
      <div 
        className={`relative w-full ${maxWidth} bg-white p-6 shadow-2xl flex flex-col max-h-[90vh] rounded-2xl transition-all duration-300 ease-out ${
          animate 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 select-none">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};