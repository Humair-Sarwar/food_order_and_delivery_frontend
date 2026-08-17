import React, { useState } from "react";
import { Heart, ShoppingBag, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import no_image from "../../../assets/images/empty-image.jpg";
import { useWishlist, useRemoveFromWishlist } from "../../../hooks/website/useWishlist";
import { useAddToCart } from "../../../hooks/website/useCart";
// Agar AddToCartToast koi custom component ya function hai, to yahan import karein:
// import { AddToCartToast } from "../../../components/common/AddToCartToast"; 
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";
import Pagination from "../../../components/common/Pagination";
import { AddToCartToast } from "../../../components/common/AddToCartToast";

export const Wishlist = () => {
  const navigate = useNavigate();
  const [isCartToastOpen, setIsCartToastOpen] = useState(false);
const [recentlyAddedItem, setRecentlyAddedItem] = useState<any>(null);
  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Pass parameters to useWishlist hook
  const { data, isLoading } = useWishlist({
    page,
    per_page: perPage,
    search: searchQuery,
  });

  const { mutate: removeFromWishlist, isPending: isDeleting } = useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // State for Delete Confirmation Modal (stores food_item_id)
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<string | null>(null);

  // Extract items and pagination safely depending on response structure (handles direct or nested data)
  const responsePayload = data?.data;
  const wishlistItems = Array.isArray(responsePayload)
    ? responsePayload
    : responsePayload?.data || [];
  
  const pagination = responsePayload?.pagination || (data as any)?.pagination;

  // Open modal with food_item ID
  const handleOpenDeleteModal = (foodItemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents card click navigation when deleting
    setSelectedItemToDelete(foodItemId);
  };

  // Close modal
  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setSelectedItemToDelete(null);
  };

  // Execute deletion with auto page reset logic for last item on page
  const handleConfirmDelete = () => {
    if (!selectedItemToDelete) return;

    removeFromWishlist(
      { food_item_id: selectedItemToDelete },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Item removed from wishlist!");
          
          // Move to previous page if the last item on the current page is deleted
          if (wishlistItems.length === 1 && page > 1) {
            setPage(page - 1);
          }

          setSelectedItemToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to remove item.");
        },
      }
    );
  };

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
  e.stopPropagation();

  const cartId = localStorage.getItem("cart_id");

  addToCart(
    {
      food_item_id: item.id,
      quantity: 1,
      ...(cartId && { cart_id: cartId }),
    },
    {
      onSuccess: (res: any) => {
        // Save cart ID if backend returns a new one
        const newCartId = res?.data?.cart_id || res?.cart_id;

        if (newCartId) {
          localStorage.setItem("cart_id", newCartId);
        }

        // Prepare item for AddToCartToast
        setRecentlyAddedItem({
          title: item?.title,
          image: item?.image?.media_path,
          restaurantName: item?.restaurant?.name,
          price:
            item?.is_on_sale && item?.sale_price !== null
              ? item?.sale_price
              : item?.regular_price,
        });

        // Open custom Add To Cart Toast
        setIsCartToastOpen(true);

        // Notify Header about cart change
        window.dispatchEvent(new Event("cartUpdated"));
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to add item to cart."
        );
      },
    }
  );
};

  return (
    <div className="space-y-8">
      {/* Page Header & Search Filter Section */}
      <div className="pb-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950">My Wishlist</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Items you have saved for later ({pagination?.total || wishlistItems.length})
          </p>
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to page 1 on search change
            }}
            placeholder="Search wishlist items..."
            className="w-full h-11 pl-11 pr-4 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-bold text-gray-950 placeholder-gray-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Wishlist Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-100 p-5 rounded-[2.5rem] border border-gray-200 h-80 animate-pulse" />
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-gray-50/50 p-12 rounded-[2rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-base">Your wishlist is empty</h3>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              {searchQuery ? "No matching items found in your wishlist." : "Explore our food items and save your favorites here."}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => navigate("/food-items/All")}
              className="mt-4 bg-gray-950 text-white hover:bg-orange-600 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md"
            >
              Explore Foods
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((wishlistItem: any) => {
              const item = wishlistItem?.food_item;
              if (!item) return null;

              const isOnSale = item?.is_on_sale === 1;
              const regPrice = Number(item?.regular_price) || 0;
              const salePrice = Number(item?.sale_price) || 0;
              const hasValidDiscount = isOnSale && regPrice > salePrice && salePrice > 0;
              const discountPercentage = hasValidDiscount
                ? Math.round(((regPrice - salePrice) / regPrice) * 100)
                : 0;

              return (
                <div
                  key={wishlistItem.id}
                  onClick={() => {
                    const categorySlug = item.category?.title ? item.category.title.toLowerCase().replace(/\s+/g, "-") : "general";
                    const productSlug = item.slug ? item.slug.toLowerCase().replace(/\s+/g, "-") : "product";
                    navigate(`/food-item/${categorySlug}/${productSlug}/${item.id}`);
                  }}
                  className="group bg-white p-5 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-orange-500/40 hover:shadow-[0_15px_40px_rgba(249,115,22,0.1)] transition-all duration-300 relative flex flex-col justify-between cursor-pointer"
                >
                  {/* Discount Badge */}
                  {hasValidDiscount && (
                    <span className="absolute top-8 left-8 z-10 bg-orange-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                      {discountPercentage}% OFF
                    </span>
                  )}

                  {/* Remove Button - Modal Open */}
                  <button
                    onClick={(e) => handleOpenDeleteModal(item.id, e)}
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
                      {item?.category?.title || "General"}
                    </span>
                    <h3 className="font-black text-lg mb-4 text-gray-950 truncate group-hover:text-orange-600 transition-colors">
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
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={isAddingToCart}
                      className="flex items-center gap-2 bg-gray-950 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={16} strokeWidth={2.2} /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Component */}
          {pagination && pagination?.total > 0 && (
            <Pagination
              currentPage={pagination?.current_page}
              totalPages={pagination?.last_page}
              totalEntries={pagination?.total}
              from={pagination?.from}
              to={pagination?.to}
              entriesPerPage={perPage}
              onPageChange={(newPage) => setPage(newPage)}
              onEntriesPerPageChange={(newEntries) => {
                setPerPage(newEntries);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(selectedItemToDelete)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Remove from Wishlist"
        message="Are you sure you want to remove this food item from your saved wishlist?"
        isLoading={isDeleting}
      />
      <AddToCartToast
  isOpen={isCartToastOpen}
  onClose={() => setIsCartToastOpen(false)}
  item={recentlyAddedItem}
  onViewCart={() => {
    setIsCartToastOpen(false);
    // Header wala cart button use karne ke bajaye
    // yahan tum apne cart page par navigate kar sakte ho
    navigate("/cart");
  }}
  onCheckout={() => {
    setIsCartToastOpen(false);
    navigate("/checkout");
  }}
/>
    </div>
  );
};

export default Wishlist;