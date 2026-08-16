import React, { useRef, useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLatestFoodItems } from "../../../hooks/website/useFoodItems";
import { useAddToCart } from "../../../hooks/website/useCart";
import { toast } from "react-toastify";
import { AddToCartToast } from "../../../components/common/AddToCartToast";
import no_image from "../../../assets/images/empty-image.jpg";

export const LatestFoodItems: React.FC = () => {
  const {
    data: latestFoodItemsResponse,
    isLoading: isLatestFoodItemsLoading,
  } = useLatestFoodItems();

  const latestFoodItems = latestFoodItemsResponse?.data ?? [];

  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // ==============================
  // Add To Cart States
  // ==============================

  const [isCartToastOpen, setIsCartToastOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<any>(null);

  const {
    mutate: addToCart,
    isPending: isAddingToCart,
  } = useAddToCart();

  // ==============================
  // Add To Cart Handler
  // ==============================

  const handleAddToCart = (
    item: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Product card ka click trigger nahi hoga
    e.stopPropagation();

    const cartId = localStorage.getItem("cart_id");

    addToCart(
      {
        food_item_id: item.id,
        quantity: 1,
        ...(cartId && {
          cart_id: cartId,
        }),
      },
      {
        onSuccess: (res: any) => {
          // New cart ID save karo
          const newCartId =
            res?.data?.cart_id || res?.cart_id;

          if (newCartId) {
            localStorage.setItem(
              "cart_id",
              newCartId
            );
          }

          // Toast ke liye item data
          setRecentlyAddedItem({
            title: item?.title,
            image: item?.image?.media_path,
            restaurantName: item?.restaurant?.name,
            price:
              item?.is_on_sale
                ? item?.sale_price
                : item?.regular_price,
          });

          // Add To Cart Toast open
          setIsCartToastOpen(true);
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to add product to cart"
          );
        },
      }
    );
  };

  // ==============================
  // Carousel
  // ==============================

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const {
        scrollLeft,
        clientWidth,
      } = scrollRef.current;

      const scrollAmount =
        clientWidth * 0.75;

      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ==============================
  // Product Detail
  // ==============================

  const handleProductClick = (item: any) => {
    const categorySlug =
      item?.category?.category_slug ||
      "general";

    const productSlug =
      item?.slug ||
      item?.title
        ?.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    navigate(
      `/food-item/${categorySlug}/${productSlug}/${item?.id}`
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (isLatestFoodItemsLoading) {
    return (
      <section className="bg-gradient-to-b from-gray-50/60 to-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-w-[270px] sm:min-w-[290px] max-w-[310px] bg-white p-5 rounded-[2.5rem] border border-gray-200/80 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-[2rem] mb-5" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-5" />

                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-24" />
                  <div className="h-10 bg-gray-200 rounded-2xl w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (latestFoodItems.length === 0) {
    return null;
  }

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50/60 to-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
                <Sparkles size={12} />
                Freshly Prepared
              </div>

              <h2 className="text-2xl font-black text-gray-950 tracking-tight sm:text-3xl flex items-center gap-2">
                <span>Latest Food Items</span>

                <Flame
                  size={22}
                  className="text-orange-500 fill-orange-500/20"
                />
              </h2>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="h-10 w-10 rounded-2xl bg-white border border-gray-200/85 text-gray-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => scroll("right")}
                className="h-10 w-10 rounded-2xl bg-white border border-gray-200/85 text-gray-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {latestFoodItems.map((item: any) => {
              const isOnSale =
                item?.is_on_sale === 1;

              const regPrice =
                Number(item?.regular_price) || 0;

              const salePrice =
                Number(item?.sale_price) || 0;

              const isAvailable =
                item?.is_available !== 0;

              const hasValidDiscount =
                isOnSale &&
                regPrice > salePrice &&
                salePrice > 0;

              const discountPercentage =
                hasValidDiscount
                  ? Math.round(
                      ((regPrice - salePrice) /
                        regPrice) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={item?.id}
                  onClick={() =>
                    handleProductClick(item)
                  }
                  className="min-w-[270px] sm:min-w-[290px] max-w-[310px] flex-1 snap-start group bg-white p-5 rounded-[2.5rem] border border-gray-200/80 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/20 transition-all duration-500 relative flex flex-col justify-between cursor-pointer"
                >

                  {/* Discount */}
                  {hasValidDiscount && (
                    <span className="absolute top-8 left-8 z-10 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {discountPercentage}% OFF
                    </span>
                  )}

                  <div>

                    {/* Image */}
                    <div className="aspect-square bg-gray-100 rounded-[2rem] mb-5 overflow-hidden shadow-inner flex items-center justify-center">
                      <img
                        src={
                          item?.image?.media_path
                            ? `${import.meta.env.VITE_API_BASE_URL}/storage/${item.image.media_path}`
                            : no_image
                        }
                        alt={
                          item?.title ||
                          "Product"
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg mb-4 text-gray-950 truncate group-hover:text-orange-600 transition-colors">
                      {item?.title}
                    </h3>
                  </div>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between mt-auto pt-2">

                    {/* Price */}
                    <div className="flex flex-col">
                      {hasValidDiscount ? (
                        <>
                          <span className="text-xl font-black text-orange-600 font-mono">
                            Rs.{" "}
                            {item?.sale_price}
                          </span>

                          <span className="text-xs text-gray-400 line-through font-mono">
                            Rs.{" "}
                            {item?.regular_price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-black text-orange-600 font-mono">
                          Rs.{" "}
                          {item?.regular_price}
                        </span>
                      )}
                    </div>

                    {/* Add To Cart */}
                    <button
                      onClick={(e) =>
                        handleAddToCart(
                          item,
                          e
                        )
                      }
                      disabled={
                        !isAvailable ||
                        isAddingToCart
                      }
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                        isAvailable
                          ? "bg-gray-950 text-white shadow-md shadow-gray-950/10 hover:bg-orange-600 hover:shadow-orange-600/20 hover:scale-105 cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                      } disabled:opacity-50`}
                    >
                      <ShoppingBag
                        size={15}
                        className={
                          isAvailable
                            ? "transition-transform group-hover:-rotate-12"
                            : ""
                        }
                      />

                      <span>
                        {isAvailable
                          ? isAddingToCart
                            ? "Adding..."
                            : "Add"
                          : "Unavailable"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* Add To Cart Toast */}
      {/* ===================================== */}

      <AddToCartToast
        isOpen={isCartToastOpen}
        onClose={() =>
          setIsCartToastOpen(false)
        }
        item={recentlyAddedItem}
        onViewCart={() => {
          setIsCartToastOpen(false);

          // Agar aapka CartModal nahi hai
          // to direct cart page:
          navigate("/cart");
        }}
        onCheckout={() => {
          setIsCartToastOpen(false);
          navigate("/checkout");
        }}
      />
    </>
  );
};

export default LatestFoodItems;