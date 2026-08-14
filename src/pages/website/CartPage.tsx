import React from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import no_image from "../../assets/images/empty-image.jpg";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../../hooks/website/useCart";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartId: any = localStorage.getItem("cart_id");

  const { data, isLoading, isError } = useCart(cartId);

  const cart = data?.data;
  const cartItems = cart?.items ?? [];
  const summary = cart?.summary;

  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();

  const handleRemove = (cartItemId: string) => {
    removeFromCart(
      { cart_item_id: cartItemId },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Item removed from cart successfully!");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to remove item.");
        },
      }
    );
  };

  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartQuantity();

  // Handle increment quantity mutation
  const handleIncrement = (itemId: string, currentQty: number) => {
    updateQuantity(
      {
        cart_item_id: itemId,
        quantity: currentQty + 1,
      },
      {
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update quantity.");
        },
      }
    );
  };

  // Handle decrement quantity mutation
  const handleDecrement = (itemId: string, currentQty: number) => {
    if (currentQty <= 1) return;

    updateQuantity(
      {
        cart_item_id: itemId,
        quantity: currentQty - 1,
      },
      {
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to update quantity.");
        },
      }
    );
  };

  // Base URL for images if stored in public storage
  const STORAGE_URL = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  // Check if the cart is empty
  const isCartEmpty = isError || cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Navigation / Back Indicator */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-2xs"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShoppingBag size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
                  Shopping Cart
                </h1>
                {!isCartEmpty && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full border border-orange-200/60">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-400 mt-1">
                Review your culinary selections and prepare for a fast checkout
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400 animate-pulse">Loading your exquisite cart...</p>
          </div>
        ) : isCartEmpty ? (
          <div className="bg-white p-12 sm:p-20 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/40 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-12">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 shadow-inner">
              <ShoppingBag size={36} />
            </div>
            <h3 className="font-black text-gray-950 text-2xl tracking-tight">Your cart is feeling lonely</h3>
            <p className="text-sm font-medium text-gray-400 mt-2 max-w-sm">
              Explore our delicious menus and treat yourself to something extraordinary today!
            </p>
            <button
              onClick={() => navigate("/food-items/All")}
              className="mt-8 inline-flex items-center gap-2 bg-gray-950 text-white hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer shadow-lg shadow-gray-950/20 active:scale-95"
            >
              <Sparkles size={16} /> Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const food = item.food_item;
                const imagePath = food?.image?.media_path;
                const imageUrl = imagePath ? `${STORAGE_URL}${imagePath}` : no_image;
                const unitPrice =
                  food?.is_on_sale && food?.sale_price !== null
                    ? food.sale_price
                    : food?.regular_price;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 hover:border-orange-200 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.08)]"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 flex-grow min-w-0">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                        <img
                          src={imageUrl}
                          alt={food?.title || "Food item"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md inline-block mb-1.5 border border-orange-100/50">
                          {food?.restaurant?.name || "Restaurant"}
                        </span>
                        <h3 className="font-extrabold text-base sm:text-lg text-gray-950 truncate tracking-tight">
                          {food?.title}
                        </h3>
                        
                        <div className="flex flex-col mt-2">
                          <span className="font-black text-gray-950 text-base sm:text-lg">
                            Rs. {item.item_total}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold tracking-wide">
                            Rs. {unitPrice} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls & Delete Section */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center gap-1.5 bg-gray-50/90 p-1.5 rounded-2xl border border-gray-100 shadow-2xs">
                        <button
                          onClick={() => handleDecrement(item.id, item.quantity)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-gray-700 shadow-2xs hover:bg-orange-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>
                        <span className="font-black w-7 text-center text-xs text-gray-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.id, item.quantity)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-gray-700 shadow-2xs hover:bg-orange-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isRemoving}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 p-1 bg-gray-50 sm:bg-transparent rounded-lg"
                      >
                        <Trash2 size={14} /> <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sticky top-8">
              <h2 className="text-xl font-black text-gray-950 mb-6 tracking-tight flex items-center gap-2">
                Order Summary
              </h2>

              {summary && (
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-950">Rs. {summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Delivery Fee</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      {summary.delivery_fee === 0 ? "Free" : `Rs. ${summary.delivery_fee}`}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-base font-black text-gray-950">Total Amount</span>
                    <span className="text-2xl font-black text-orange-600">
                      Rs. {summary.total}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                disabled={isCartEmpty}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-950 to-gray-900 text-white py-4 rounded-2xl font-extrabold hover:from-orange-600 hover:to-orange-500 transition-all duration-300 active:scale-95 shadow-xl shadow-gray-950/20 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer text-sm"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold">
                <ShieldCheck size={16} className="text-orange-500" />
                <span>Encrypted & Secure Express Checkout</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;