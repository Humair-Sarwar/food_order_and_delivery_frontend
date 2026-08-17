import React from "react";
import { Check, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartToastProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    image?: string;
    restaurantName?: string;
    price?: number;
  } | null;
  onViewCart: () => void;
  onCheckout: () => void;
}

export const AddToCartToast: React.FC<AddToCartToastProps> = ({
  isOpen,
  onClose,
  item,
  onViewCart,
  onCheckout,
}) => {
  const STORAGE_URL = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[110] mb-0!"
          />

          {/* Toast Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[120] sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 flex flex-col gap-4 overflow-hidden mx-auto sm:mx-0"
          >
            {/* Top Success Badge & Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-xs font-black tracking-wide">
                  Added to your cart!
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Preview Row */}
            {item && (
              <div className="flex items-center gap-3.5 bg-gray-50/80 p-3 rounded-2xl border border-gray-100/80">
                <div className="relative w-14 h-14 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image ? (
                    <img
                      src={item.image.startsWith("http") ? item.image : `${STORAGE_URL}${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-gray-950 text-sm truncate">
                    {item.title}
                  </h4>
                  {item.restaurantName && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {item.restaurantName}
                    </p>
                  )}
                  {item.price && (
                    <span className="font-black text-orange-600 text-xs mt-1 block">
                      Rs. {item.price}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onViewCart}
                className="w-full py-2.5 rounded-xl font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all text-xs cursor-pointer"
              >
                View Cart
              </button>
              <button
                onClick={onCheckout}
                className="w-full bg-orange-600 text-white py-2.5 rounded-xl font-bold hover:bg-orange-500 transition-all text-xs shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};