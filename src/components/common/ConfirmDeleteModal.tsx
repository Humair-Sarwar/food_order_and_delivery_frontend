import React from "react";
import { Trash2, X } from "lucide-react";
import Spinner from "./Spinner";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
  isLoading = false,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 1. BACKDROP OVERLAY (Smooth blur and fade) */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[4px] cursor-pointer"
        onClick={onClose}
      />

      {/* 2. MODAL CARD CONTAINER (Smooth pop-up scale & subtle slide up) */}
      <div
        className={`relative w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl shadow-gray-900/20 z-10 transition-all duration-300 ease-out transform ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 inline-flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 3. CONTENT BOX */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Glowing Warning/Trash Icon */}
          <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-black text-gray-900 tracking-tight">
            {title}
          </h3>

          <p className="text-xs font-semibold text-gray-400 mt-2 leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* 4. ACTIONS FOOTER */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="h-10 text-xs font-black text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-98"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 text-xs font-black text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md shadow-red-500/10 transition-all cursor-pointer disabled:opacity-50 active:scale-98 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="16px" color="#ffffff" thickness="2px" />
                <span>Deleting...</span>
              </div>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
