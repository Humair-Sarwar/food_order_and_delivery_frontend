import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRelatedProducts } from "../../../hooks/website/useFoodItems";
import { useAddToCart } from "../../../hooks/website/useCart";
import no_image from "../../../assets/images/empty-image.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AddToCartToast } from "../../../components/common/AddToCartToast";
import { CartModal } from "../../../components/website/CartModal";

export const RelatedProducts: React.FC<{ id: string }> = ({ id }) => {
  const {
    data: relatedProductsResponse,
    isLoading: isRelatedProductsLoading,
  } = useRelatedProducts({
    food_item_id: id,
  });

  const relatedProducts = relatedProductsResponse?.data?.products || [];

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Cart states
  const [isCartToastOpen, setIsCartToastOpen] = useState(false);
  const [isCartSideModalOpen, setIsCartSideModalOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<any>(null);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const navigate = useNavigate();

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setCanScrollLeft(scrollLeft > 5);

      setCanScrollRight(
        scrollLeft + clientWidth < scrollWidth - 5
      );
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      checkScrollPosition();

      scrollContainer.addEventListener(
        "scroll",
        checkScrollPosition
      );

      window.addEventListener("resize", checkScrollPosition);

      return () => {
        scrollContainer.removeEventListener(
          "scroll",
          checkScrollPosition
        );

        window.removeEventListener(
          "resize",
          checkScrollPosition
        );
      };
    }
  }, [relatedProducts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;

      const scrollAmount = clientWidth * 0.75;

      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Add to Cart
  const handleAddToCart = (
    item: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Prevent NavLink from opening detail page
    e.preventDefault();
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
          const newCartId = res?.data?.cart_id || res?.cart_id;

          if (newCartId) {
            localStorage.setItem("cart_id", newCartId);
          }

          // Same data structure as ProductListingPage
          setRecentlyAddedItem({
            title: item?.title,
            image: item?.image?.media_path,
            restaurantName: item?.restaurant?.name,
            price: item?.is_on_sale
              ? item?.sale_price
              : item?.regular_price,
          });

          // Open Add To Cart Toast
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

  // Don't show section if there are no related products
  if (
    !isRelatedProductsLoading &&
    relatedProducts.length === 0
  ) {
    return null;
  }

  return (
    <>
      <section className="mt-20 bg-gradient-to-b from-gray-50/50 to-white py-16 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles size={12} />
                Curated Picks
              </div>

              <h2 className="text-2xl font-black text-gray-950 tracking-tight sm:text-3xl">
                Other Food Items
              </h2>
            </div>
          </div>

          {/* Slider Wrapper */}
          <div className="relative group/slider">

            {/* Left Button */}
            <button
              onClick={() => scroll("left")}
              className={`absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 cursor-pointer z-20 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                canScrollLeft
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Carousel */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto pb-6 pt-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-1"
            >
              <div className="flex justify-start lg:justify-center items-stretch gap-4 sm:gap-6 w-max mx-auto px-1">

                {/* Loading Skeleton */}
                {isRelatedProductsLoading
                  ? [1, 2, 3, 4].map((_, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[310px] bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm animate-pulse"
                      >
                        <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />

                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />

                        <div className="border-t border-gray-100 pt-4 flex justify-between">
                          <div>
                            <div className="h-3 bg-gray-200 rounded w-12 mb-2" />
                            <div className="h-5 bg-gray-200 rounded w-20" />
                          </div>

                          <div className="h-10 w-20 bg-gray-200 rounded-xl" />
                        </div>
                      </div>
                    ))
                  : relatedProducts.map((item: any) => (

                      <NavLink
                        key={item.id}
                        to={`/food-item/${item.category?.slug}/${item.slug}/${item.id}`}
                        className="group flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[310px] bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between"
                      >

                        <div>
                          {/* Image */}
                          <div className="relative aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden shadow-inner">

                            <img
                              src={
                                item?.image?.media_path
                                  ? `${import.meta.env.VITE_API_BASE_URL}/storage/${item.image.media_path}`
                                  : no_image
                              }
                              alt={item?.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />

                            {/* Category */}
                            {item?.category?.title && (
                              <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md text-white font-bold text-[10px] rounded-lg tracking-wider uppercase border border-white/10">
                                {item.category.title}
                              </span>
                            )}
                          </div>

                          {/* Product Name */}
                          <h3 className="font-extrabold text-gray-950 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                            {item?.title}
                          </h3>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

                          {/* Price */}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Price
                            </span>

                            <span className="font-mono font-black text-orange-600 text-base">
                              Rs.{" "}
                              {item?.is_on_sale
                                ? item?.sale_price
                                : item?.regular_price}
                            </span>
                          </div>

                          {/* Add To Cart */}
                          <button
                            type="button"
                            disabled={
                              isAddingToCart ||
                              item?.is_available === 0
                            }
                            onClick={(e) =>
                              handleAddToCart(item, e)
                            }
                            className={`h-10 w-10 sm:w-auto sm:px-4 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 ${
                              item?.is_available === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20 cursor-pointer"
                            }`}
                          >
                            <ShoppingBag
                              size={16}
                              className="shrink-0"
                            />

                            <span className="hidden sm:inline">
                              {item?.is_available === 0
                                ? "Unavailable"
                                : isAddingToCart
                                ? "Adding..."
                                : "Add"}
                            </span>
                          </button>
                        </div>
                      </NavLink>
                    ))}
              </div>
            </div>

            {/* Right Button */}
            <button
              onClick={() => scroll("right")}
              className={`absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 cursor-pointer w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-xl ${
                canScrollRight
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3 pointer-events-none"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>

          </div>
        </div>
      </section>

      {/* Add To Cart Toast */}
      <AddToCartToast
        isOpen={isCartToastOpen}
        onClose={() => setIsCartToastOpen(false)}
        item={recentlyAddedItem}
        onViewCart={() => {
          setIsCartToastOpen(false);
          setIsCartSideModalOpen(true);
        }}
        onCheckout={() => {
          setIsCartToastOpen(false);
          navigate("/checkout");
        }}
      />

      {/* Side Cart Modal */}
      <CartModal
        isOpen={isCartSideModalOpen}
        onClose={() => setIsCartSideModalOpen(false)}
      />
    </>
  );
};