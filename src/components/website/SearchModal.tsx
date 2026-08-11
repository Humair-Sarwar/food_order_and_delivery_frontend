import React from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />

          {/* Side Panel (Right side floating card) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 my-4 mr-4 h-[calc(100vh-32px)] w-[calc(100vw-32px)] md:w-[450px] rounded-3xl bg-white z-[101] shadow-2xl p-8 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-950">Search</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input Field */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                autoFocus
                type="text"
                placeholder="Search food, restaurants..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-all text-gray-900"
              />
            </div>

            {/* Placeholder Content Area */}
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 gap-4">
              {/* Badi size ka icon, thoda halka (opacity) */}
              <Search size={64} strokeWidth={1.5} className="opacity-30" />

              <div className="text-center">
                <p className="font-semibold text-gray-600">
                  Looking for something?
                </p>
                <p className="text-sm mt-1">
                  Start typing above to search our food.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
