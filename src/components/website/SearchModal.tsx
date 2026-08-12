import React, { useState } from "react";
import { X, Search, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchFoodItems } from "../../hooks/website/useFoodItems";
import { useNavigate } from "react-router-dom";
import no_image from "../../assets/images/empty-image.jpg";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isPending } = useSearchFoodItems({
    search,
  });

  const products = data?.data || [];

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
            <div className="relative flex items-center">
              <Search
                className="absolute left-3 text-gray-400 pointer-events-none"
                size={20}
              />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food, restaurants..."
                className="w-full pl-11 pr-10 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-all text-gray-900"
              />
              {search.trim() !== "" && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto mt-6 pr-1 space-y-4">
              {search.trim() === "" ? (
                // Initial State
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
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
              ) : isPending ? (
                // Skeleton Loading State
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                // API Results
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 capitalize tracking-wider mb-2">
                    Products ({products.length})
                  </p>
                  {products.map((product: any) => {
                    const isOnSale =
                      product.is_on_sale === 1 &&
                      product.sale_price &&
                      product.sale_price !== product.regular_price;

                    const isInStock = product.is_available === 1;

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          const categorySlug =
                            product?.category?.slug ||
                            product?.category?.title
                              ?.toLowerCase()
                              .replace(/\s+/g, "-") ||
                            "all";
                          const productTitleSlug =
                            product?.title
                              ?.toLowerCase()
                              .replace(/\s+/g, "-") || "product";
                          setSearch("");
                          navigate(
                            `/food-item/${categorySlug}/${productTitleSlug}/${product.id}`
                          );
                          onClose();
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group"
                      >
                        <img
                          src={
                            product?.image?.media_path
                              ? `${import.meta.env.VITE_API_BASE_URL}/storage/${product.image.media_path}`
                              : no_image
                          }
                          alt={product.title}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            {product?.category?.title && (
                              <span className="text-[9px] font-bold text-orange-600 border uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-full">
                                {product.category.title}
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-bold capitalize tracking-wider px-2 py-0.5 rounded-full ${
                                isInStock
                                  ? "text-emerald-600 bg-emerald-100 border"
                                  : "text-rose-600 bg-rose-100 border"
                              }`}
                            >
                              {isInStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                         <h4 className="font-bold text-gray-950 mt-1 group-hover:text-orange-600 text-[13px] transition-colors truncate">
    {product.title}
  </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {isOnSale ? (
                              <>
                                <p className="text-sm font-bold text-orange-600">
                                  Rs. {product.sale_price}
                                </p>
                                <p className="text-xs font-semibold text-gray-400 line-through">
                                  Rs. {product.regular_price}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-semibold text-gray-500">
                                Rs. {product.regular_price}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-all text-gray-400 flex-shrink-0">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // No Results State
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                  <ShoppingBag size={48} strokeWidth={1.5} className="opacity-30" />
                  <div className="text-center">
                    <p className="font-semibold text-gray-600">No results found</p>
                    <p className="text-sm mt-1">
                      We couldn't find anything matching "{search}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};