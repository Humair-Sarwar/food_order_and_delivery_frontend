import React, { useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import no_image from "../../../assets/images/empty-image.jpg";

export const Wishlist = () => {
  const navigate = useNavigate();

  // Dummy wishlist items - aap isay apni actual wishlist state ya API se connect kar sakte hain
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: "Zinger Burger with Cheese",
      regular_price: 650,
      sale_price: 550,
      is_on_sale: 1,
      category: { title: "Fast Food" },
      image: { media_path: "" },
    },
    {
      id: 2,
      title: "Chicken Supreme Pizza (Large)",
      regular_price: 1800,
      sale_price: 1599,
      is_on_sale: 1,
      category: { title: "Pizzas" },
      image: { media_path: "" },
    },
    {
      id: 3,
      title: "Special Mixed Grill Platter",
      regular_price: 2500,
      sale_price: 0,
      is_on_sale: 0,
      category: { title: "BBQ & Grill" },
      image: { media_path: "" },
    },
  ]);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950">My Wishlist</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Items you have saved for later ({wishlistItems.length})
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      {wishlistItems.length === 0 ? (
        <div className="bg-gray-50/50 p-12 rounded-[2rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-base">Your wishlist is empty</h3>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Explore our food items and save your favorites here.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-gray-950 text-white hover:bg-orange-600 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md"
          >
            Explore Foods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const isOnSale = item?.is_on_sale === 1;
            const regPrice = Number(item?.regular_price) || 0;
            const salePrice = Number(item?.sale_price) || 0;
            const hasValidDiscount = isOnSale && regPrice > salePrice && salePrice > 0;
            const discountPercentage = hasValidDiscount
              ? Math.round(((regPrice - salePrice) / regPrice) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="group bg-white p-5 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-orange-500/40 hover:shadow-[0_15px_40px_rgba(249,115,22,0.1)] transition-all duration-300 relative flex flex-col justify-between"
              >
                {/* Discount Badge */}
                {hasValidDiscount && (
                  <span className="absolute top-8 left-8 z-10 bg-orange-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                    {discountPercentage}% OFF
                  </span>
                )}

                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-8 right-8 z-10 w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 shadow-md border border-gray-100 transition-all cursor-pointer active:scale-95"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={18} strokeWidth={2.2} />
                </button>

                <div>
                  <div className="aspect-square bg-gray-50/80 border border-gray-100/80 rounded-[2rem] mb-5 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={
                        item?.image?.media_path
                          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${item?.image?.media_path}`
                          : no_image
                      }
                      alt={item?.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <span className="text-xs font-black text-orange-600 uppercase tracking-widest block mb-1.5">
                    {item?.category?.title}
                  </span>
                  <h3 className="font-black text-lg mb-4 text-gray-950 truncate">
                    {item?.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    {hasValidDiscount ? (
                      <>
                        <span className="text-lg font-black text-gray-950">
                          Rs. {item?.sale_price}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold line-through">
                          Rs. {item?.regular_price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-gray-950">
                        Rs. {item?.regular_price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => console.log("Added to cart from wishlist:", item.id)}
                    className="flex items-center gap-2 bg-gray-950 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag size={16} strokeWidth={2.2} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;