import React from "react";
import { X, ShoppingBag, Lock, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../../hooks/website/useCart";
import { useNavigate } from "react-router-dom";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const cartId: any = localStorage.getItem("cart_id");
  const navigation = useNavigate()
  const { data, isLoading, isError } = useCart(cartId);

  const cart = data?.data;
  const cartItems = cart?.items ?? [];
  const summary = cart?.summary;

  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();

  const handleRemove = (cartItemId: string) => {
    removeFromCart({
      cart_item_id: cartItemId,
    });
  };

  const { mutate: updateQuantity, isPending: isUpdating } =
    useUpdateCartQuantity();

  // Handle increment quantity mutation
  const handleIncrement = (itemId: string, currentQty: number) => {
    updateQuantity({
      cart_item_id: itemId,
      quantity: currentQty + 1,
    });
  };

  // Handle decrement quantity mutation
  const handleDecrement = (itemId: string, currentQty: number) => {
    if (currentQty <= 1) return;

    updateQuantity({
      cart_item_id: itemId,
      quantity: currentQty - 1,
    });
  };

  // Base URL for images if stored in public storage (adjust based on your backend setup)
  const STORAGE_URL = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  // Check if the cart is empty
  const isCartEmpty = isError || cartItems.length === 0;

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

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 my-4 mr-4 h-[calc(100vh-32px)] w-[calc(100vw-32px)] md:w-[480px] rounded-3xl bg-white z-[101] shadow-2xl p-6 md:p-8 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-gray-950">Your Cart</h2>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors text-gray-500 hover:text-gray-950"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Content / Items List */}
            <div className="flex-grow overflow-y-auto space-y-4 py-4 pr-1">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-gray-400 font-medium">
                  Loading cart...
                </div>
              ) : isCartEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-gray-600">
                    Your cart is currently empty.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const food = item.food_item;
                  const imagePath = food?.image?.media_path;
                  const imageUrl = imagePath
                    ? `${STORAGE_URL}${imagePath}`
                    : null;
                  const unitPrice =
                    food?.is_on_sale && food?.sale_price !== null
                      ? food.sale_price
                      : food?.regular_price;

                  return (
                    <div
                      key={item.id}
                      className="group relative flex items-center p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100/80 hover:border-gray-200 transition-all gap-4"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100 shadow-xs">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={food?.title || "Food item"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag size={20} />
                          </div>
                        )}
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {food?.title}
                          </h4>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={isRemoving}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {food?.restaurant?.name || "Restaurant"}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Price & Quantity Breakdown */}
                          <div className="flex flex-col">
                            <span className="font-black text-gray-950 text-sm">
                              Rs. {item.item_total}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              Rs. {unitPrice} × {item.quantity}
                            </span>
                          </div>

                          {/* Plus / Minus Quantity Controls */}
                          <div className="flex items-center bg-gray-100/80 border border-gray-200/80 p-0.5 rounded-xl shadow-2xs">
                            <button
                              onClick={() =>
                                handleDecrement(item.id, item.quantity)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-950 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-gray-950">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleIncrement(item.id, item.quantity)
                              }
                              disabled={isUpdating}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-950 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* Summary / Totals Row (Hidden when cart is empty) */}
              {!isCartEmpty && summary && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      Rs. {summary.subtotal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">
                      {summary.delivery_fee === 0
                        ? "Free"
                        : `Rs. ${summary.delivery_fee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold text-gray-950 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="font-black text-orange-600">
                      Rs. {summary.total}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons (Disabled when cart is empty) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                onClick={()=> {
                  navigation('/cart')
                  onClose()
                }}
                  disabled={isCartEmpty}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gray-950 hover:bg-gray-800 transition-all text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  View Cart
                </button>
                <button
                onClick={()=> {
                  navigation('/checkout')
                  onClose()
                }}
                  disabled={isCartEmpty}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-500 transition-all text-sm shadow-md shadow-orange-600/20 active:scale-95 disabled:bg-orange-200 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                >
                  Checkout
                </button>
              </div>

              {/* Secure Checkout Note */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Lock size={12} className="text-black" />
                <span>Safe & secure checkout. Easy and fast.</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
