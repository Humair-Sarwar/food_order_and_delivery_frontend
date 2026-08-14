import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  Lock,
  XCircle,
  CheckCircle2,
  Store,
  Tag,
  Heart,
} from "lucide-react";
import { RelatedProducts } from "./RelatedProducts";
import { useFoodItemDetail } from "../../../hooks/website/useFoodItems";
import { useAddToWishlist, useRemoveFromWishlist } from "../../../hooks/website/useWishlist";
// Import cart hook (adjust the import path based on your project structure)
import { useAddToCart } from "../../../hooks/website/useCart";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import no_image from "../../../assets/images/empty-image.jpg";
import { AddToCartToast } from "../../../components/common/AddToCartToast";

export const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartToastOpen, setIsCartToastOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<any>(null);
  // Check if user is logged in (adjust token key based on your project configuration)
  const isLoggedIn = Boolean(localStorage.getItem("token")); 
  // Alternatively, if you have an auth context/hook, use that:
  // const { isAuthenticated: isLoggedIn } = useAuth();

  const { data, isPending } = useFoodItemDetail({
    id: id,
  });

  const { mutate: addToWishlist, isPending: isAddingWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingWishlist } = useRemoveFromWishlist();
  
  // Add to cart hook initialization
  const { mutate: addToCart, isPending: isAddingCart } = useAddToCart();

  const foodItem = data?.data;
  const apiWishlistStatus = (data?.data as any)?.is_wishlisted;

  // Sync wishlist status from API response when data is loaded
  useEffect(() => {
    if (typeof apiWishlistStatus === "boolean") {
      setIsWishlisted(apiWishlistStatus);
    }
  }, [apiWishlistStatus]);

  // Handle Wishlist Toggle
  const handleWishlistToggle = () => {
    if (!id || isAddingWishlist || isRemovingWishlist) return;

    if (isWishlisted) {
      // Remove from wishlist
      removeFromWishlist(
        { food_item_id: id },
        {
          onSuccess: (res: any) => {
            setIsWishlisted(false);
            toast.success(res?.message || "Removed from wishlist!");
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to remove item.");
          },
        }
      );
    } else {
      // Add to wishlist
      addToWishlist(
        { food_item_id: id },
        {
          onSuccess: (res: any) => {
            setIsWishlisted(true);
            toast.success(res?.message || "Added to wishlist!");
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to add item.");
          },
        }
      );
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
  if (!id || isAddingCart || !isAvailable) return;

  const cartId = localStorage.getItem("cart_id");

  addToCart(
    {
      food_item_id: id,
      quantity: quantity,
      ...(cartId && { cart_id: cartId }),
    },
    {
      onSuccess: (res: any) => {
        // Save cart ID for future additions
        const newCartId = res?.data?.cart_id || res?.cart_id;

        if (newCartId) {
          localStorage.setItem("cart_id", newCartId);
        }

        // Save item information for AddToCartToast
        setRecentlyAddedItem({
          title: foodItem?.title,
          image: foodItem?.image?.media_path,
          restaurantName: foodItem?.restaurant?.name,
          price: hasValidDiscount
            ? Number(foodItem?.sale_price)
            : Number(foodItem?.regular_price),
        });

        // Open custom Add To Cart Toast
        setIsCartToastOpen(true);
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

  // Discount & Price validation logic
  const isOnSale = foodItem?.is_on_sale === 1;
  const regPrice = Number(foodItem?.regular_price) || 0;
  const salePrice = Number(foodItem?.sale_price) || 0;
  
  const hasValidDiscount = isOnSale && regPrice > salePrice && salePrice > 0;
  const discountPercentage = hasValidDiscount 
    ? Math.round(((regPrice - salePrice) / regPrice) * 100)
    : 0;

  const isAvailable = foodItem?.is_available === 1;

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        {/* Top Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Image Skeleton */}
          <div className="aspect-[4/3] bg-gray-200 rounded-3xl" />

          {/* Right Info Skeleton */}
          <div className="flex flex-col space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-4 mt-4">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-20 bg-gray-200 rounded w-full mt-2" />
            <div className="h-10 bg-gray-200 rounded w-40 mt-4" />
            <div className="flex items-center gap-4 mt-6">
              <div className="h-12 bg-gray-200 rounded-2xl w-32" />
              <div className="h-12 bg-gray-200 rounded-2xl flex-grow" />
            </div>
          </div>
        </div>

        {/* Bottom Description Skeleton */}
        <div className="mt-20 border-t border-gray-100 pt-12 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section: Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Single Large Image */}
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm bg-gray-50">
            <img
              src={
                foodItem?.image?.media_path
                  ? `${import.meta.env.VITE_API_BASE_URL}/storage/${foodItem?.image?.media_path}`
                  : no_image
              }
              alt={foodItem?.title || "Product"}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">
              Best Seller
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 mt-2">
              {foodItem?.title}
            </h1>

            {/* Category and Restaurant in a Single Line */}
            {(foodItem?.category?.title) && (
              <div className="flex items-center gap-3 mt-3 text-sm font-semibold text-gray-500">
                {/* Category */}
                {(foodItem?.category?.title) && (
                  <div className="flex items-center gap-1.5">
                    <Tag size={15} className="text-orange-600" />
                    <span>{foodItem?.category?.title}</span>
                  </div>
                )}

                {/* Separator dot if both exist */}
                {(foodItem?.category?.title) && 
                 (foodItem?.restaurant?.name) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}

                {/* Restaurant */}
                {(foodItem?.restaurant?.name) && (
                  <div className="flex items-center gap-1.5">
                    <Store size={15} className="text-orange-600" />
                    <span>{foodItem?.restaurant?.name}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-gray-500 text-sm">(128 Reviews)</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex flex-col">
                {hasValidDiscount ? (
                  <div className="flex items-center gap-2">
                    {/* Sale Price */}
                    <span className="text-4xl font-black text-orange-600">
                      Rs. {foodItem?.sale_price}
                    </span>

                    {/* Sale Badge */}
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-black text-orange-600">
                    Rs. {foodItem?.regular_price}
                  </span>
                )}

                {/* Original Price / Strikethrough */}
                {hasValidDiscount && (
                  <span className="text-gray-400 font-medium line-through decoration-gray-400 mt-1">
                    Rs. {foodItem?.regular_price}
                  </span>
                )}
              </div>
            </div>

            {/* Stock status and Wishlist Button Section */}
            <div className="flex items-center justify-between mt-4">
              <div>
                {!isAvailable ? (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                    <XCircle size={18} strokeWidth={2.5} />
                    Out of Stock
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    In Stock
                  </div>
                )}
              </div>

              {/* Wishlist Button - Rendered only if user is logged in */}
              {isLoggedIn && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={isAddingWishlist || isRemovingWishlist}
                  className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"}
                  />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </button>
              )}
            </div>

            {/* Controls & Add to Cart */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isAvailable}
                  className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="font-black text-lg text-gray-950 w-8 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isAvailable}
                  className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAddingCart}
                className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                  isAvailable && !isAddingCart
                    ? "bg-gray-950 text-white hover:bg-gray-800 active:scale-95 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={20} /> 
                {isAddingCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="text-orange-600" />{" "}
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ShieldCheck className="text-orange-600" />{" "}
                <span className="text-sm font-medium">Fresh Quality</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard className="text-orange-600" />{" "}
                <span className="text-sm font-medium">Easy Payment</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
                <Lock size={16} className="text-gray-400" />
                <span className="font-medium">
                  Safe & secure checkout. Easy and fast.
                </span>
              </div>

              {/* Payment Icons */}
              <div className="flex items-center justify-center gap-3 flex-wrap transition-all">
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                  <img
                    src="/payment-icons/mastercard.png"
                    alt="Mastercard"
                    className="h-6 object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                  <img
                    src="/payment-icons/visa.png"
                    alt="Visa"
                    className="h-6 object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                  <img
                    src="/payment-icons/easypaisa.jpg"
                    alt="Easypaisa"
                    className="h-6 object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg h-10 w-16 flex items-center justify-center">
                  <img
                    src="/payment-icons/jazzcash.png"
                    alt="JazzCash"
                    className="h-6 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Detailed Description */}
        <div className="mt-20 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-black text-gray-950 mb-6">
            Product Details
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              {foodItem?.description ||
                "Our Delicious product is crafted with passion, using only the finest ingredients sourced from local farms."}
            </p>
          </div>
        </div>
      </div>
      <RelatedProducts />
      <AddToCartToast
  isOpen={isCartToastOpen}
  onClose={() => setIsCartToastOpen(false)}
  item={recentlyAddedItem}
  onViewCart={() => {
    setIsCartToastOpen(false);

    // Agar CartModal use karna hai to yahan open karo
    // setIsCartSideModalOpen(true);

    // Ya direct cart page:
    navigate("/cart");
  }}
  onCheckout={() => {
    setIsCartToastOpen(false);

    // Checkout page
    navigate("/checkout");
  }}
/>
    </>
  );
};

export default ProductDetail;