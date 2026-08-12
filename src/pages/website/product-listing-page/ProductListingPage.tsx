import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Categories } from "./Categories";
import { useWebFoodItems } from "../../../hooks/website/useFoodItems";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import no_image from "../../../assets/images/empty-image.jpg";
import Pagination from "../../../components/common/Pagination";
import { useWebRestaurants } from "../../../hooks/website/useRestaurants";
import { useWebFilterCategories } from "../../../hooks/website/categoryService";
import type { WebFoodItemsResponse } from "../../../services/website/foodItemService";

// Helper function to format strings for URL slugs (slugify)
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

// Reusable Accordion Component for Filters
const FilterSection = ({ title, isOpen, onToggle, children }: any) => (
  <div className="border-t border-gray-100 py-6">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full font-black text-gray-950 cursor-pointer"
    >
      {title}
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    <div
      className={`mt-4 space-y-4 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
    >
      {children}
    </div>
  </div>
);

export const ProductListingPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>("price");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Read query parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters with proper fallbacks
  const currentPage = Number(searchParams.get("page")) || 1;
  const entriesPerPage = Number(searchParams.get("per_page")) || 10;
  const searchQueryParam = searchParams.get("search") || "";
  const isAvailableParam = searchParams.get("is_available") === "1";
  const isOnSaleParam = searchParams.get("on_sale") === "1";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const restaurantParam = searchParams.get("restaurant") || "";
  const categoryParam = searchParams.get("category") || "";

  // Parse selected restaurant and category IDs from comma-separated URL strings
  const selectedRestaurants = restaurantParam ? restaurantParam.split(",") : [];
  const selectedCategories = categoryParam ? categoryParam.split(",") : [];

  // Local state for smooth user input typing without triggering instant re-renders
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Fetch dynamic restaurant and category lists
  const { data: restaurantListing } = useWebRestaurants();
  const restaurantsList = restaurantListing?.data ?? [];

  const { data: categoriesFilter } = useWebFilterCategories();
  const categoriesFilterData = categoriesFilter?.data ?? [];

  // Pass parameters to the API hook including multi-restaurant and multi-category filters
  const { data, isPending } = useWebFoodItems({
    url: slug,
    page: currentPage,
    per_page: entriesPerPage,
    search: searchQueryParam,
    is_available: isAvailableParam ? 1 : undefined,
    on_sale: isOnSaleParam ? 1 : undefined,
    min_price: minPriceParam ? Number(minPriceParam) : undefined,
    max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
    restaurant: restaurantParam || undefined,
    category: categoryParam || undefined,
  });
  const responseData = (data as any)?.data as WebFoodItemsResponse | undefined;
  const foodItems: any[] = Array.isArray(responseData) 
  ? responseData 
  : (Array.isArray(responseData?.data) ? responseData.data : []);
  const totalPages = responseData?.pagination?.last_page ?? 1;
  const totalEntries = responseData?.pagination?.total ?? 0;
  const from = responseData?.pagination?.from ?? 0;
  const to = responseData?.pagination?.to ?? 0;

  // Calculate dynamic slider maximum limit ensuring it accommodates manual high inputs and dataset prices
  const calculatedMaxPrice = (Array.isArray(foodItems) ? foodItems : []).reduce((max: number, item: any) => {
  const p = Number(item?.regular_price) || 0;
  return p > max ? p : max;
}, 10000);

  const SLIDER_MIN = 0;
  // Dynamically scale SLIDER_MAX if the user inputs a max price greater than current max
  const parsedMaxPrice = Number(maxPrice) || 0;
  const SLIDER_MAX = Math.max(calculatedMaxPrice, parsedMaxPrice, 10000);
  const SLIDER_STEP = SLIDER_MAX > 20000 ? 500 : 100;

  // Sync local states if the URL parameters change externally
  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  useEffect(() => {
    setMinPrice(minPriceParam);
  }, [minPriceParam]);

  useEffect(() => {
    setMaxPrice(maxPriceParam);
  }, [maxPriceParam]);

  // Prevent body scroll when filter modal is open on mobile
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterModalOpen]);

  // Helper function to update search params while strictly preserving the "url" parameter (if used elsewhere)
  const updateUrlParams = (updater: (params: URLSearchParams) => void) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const currentUrl = prev.get("url");

      updater(newParams);

      if (currentUrl && currentUrl.trim() !== "") {
        newParams.set("url", currentUrl);
      }

      return newParams;
    });
  };

  // Handle typing inside the search box
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    updateUrlParams((newParams) => {
      if (value.trim()) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");
    });
  };

  // Handle Min Price input/slider change
  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);

    updateUrlParams((newParams) => {
      if (value.trim() !== "") {
        newParams.set("min_price", value);
      } else {
        newParams.delete("min_price");
      }
      newParams.set("page", "1");
    });
  };

  // Handle Max Price input/slider change
  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);

    updateUrlParams((newParams) => {
      if (value.trim() !== "") {
        newParams.set("max_price", value);
      } else {
        newParams.delete("max_price");
      }
      newParams.set("page", "1");
    });
  };

  // Handle individual restaurant checkbox selection for multi-filtering via URL
  const handleRestaurantToggle = (restaurantId: string) => {
    let updatedRestaurants = [...selectedRestaurants];

    if (updatedRestaurants.includes(restaurantId)) {
      updatedRestaurants = updatedRestaurants.filter((id) => id !== restaurantId);
    } else {
      updatedRestaurants.push(restaurantId);
    }

    updateUrlParams((newParams) => {
      if (updatedRestaurants.length > 0) {
        newParams.set("restaurant", updatedRestaurants.join(","));
      } else {
        newParams.delete("restaurant");
      }
      newParams.set("page", "1");
    });
  };

  // Handle individual category checkbox selection for multi-filtering via URL
  const handleCategoryToggle = (categoryId: string) => {
    let updatedCategories = [...selectedCategories];

    if (updatedCategories.includes(categoryId)) {
      updatedCategories = updatedCategories.filter((id) => id !== categoryId);
    } else {
      updatedCategories.push(categoryId);
    }

    updateUrlParams((newParams) => {
      if (updatedCategories.length > 0) {
        newParams.set("category", updatedCategories.join(","));
      } else {
        newParams.delete("category");
      }
      newParams.set("page", "1");
    });
  };

  // Handle "In stock only" toggle change and sync with URL search params
  const handleInStockToggle = () => {
    const nextValue = !isAvailableParam;
    updateUrlParams((newParams) => {
      if (nextValue) {
        newParams.set("is_available", "1");
      } else {
        newParams.delete("is_available");
      }
      newParams.set("page", "1");
    });
  };

  // Handle "On Sale" checkbox change and sync with URL search params
  const handleOnSaleToggle = () => {
    const nextValue = !isOnSaleParam;
    updateUrlParams((newParams) => {
      if (nextValue) {
        newParams.set("on_sale", "1");
      } else {
        newParams.delete("on_sale");
      }
      newParams.set("page", "1");
    });
  };

  const handlePageChange = (page: number) => {
    updateUrlParams((newParams) => {
      newParams.set("page", page.toString());
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEntriesPerPageChange = (entries: number) => {
    updateUrlParams((newParams) => {
      newParams.set("per_page", entries.toString());
      newParams.set("page", "1");
    });
  };

  // Reusable Filter Content Component to share between desktop sidebar and mobile modal
  const FilterContent = () => (
    <>
      <div className="flex items-center gap-2 font-black text-xl mb-6">
        <SlidersHorizontal size={20} className="text-orange-600" /> Filters
      </div>

      {/* Stock Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold text-gray-700">In stock only</span>
        <button
          onClick={handleInStockToggle}
          className={`w-12 h-6 rounded-full transition-all flex items-center p-1 cursor-pointer ${isAvailableParam ? "bg-orange-600 justify-end" : "bg-gray-200"}`}
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
        </button>
      </div>

      {/* Price Range Accordion */}
      <FilterSection
        title="Price Range"
        isOpen={openSection === "price"}
        onToggle={() =>
          setOpenSection(openSection === "price" ? null : "price")
        }
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 min-w-0"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 min-w-0"
          />
        </div>
        
        {/* Dual Range Sliders with strict bounds containment */}
        <div className="space-y-3 pt-4 pb-2 overflow-hidden">
          <div className="relative h-2 bg-gray-200 rounded-full">
            {/* Visual range highlight bar with safe percentage clamp */}
            <div
              className="absolute h-full bg-orange-600 rounded-full"
              style={{
                left: `${Math.min(Math.max(((Number(minPrice) || SLIDER_MIN) / SLIDER_MAX) * 100, 0), 100)}%`,
                right: `${Math.min(Math.max(100 - ((Number(maxPrice) || SLIDER_MAX) / SLIDER_MAX) * 100, 0), 100)}%`,
              }}
            />
          </div>

          <div className="relative flex items-center h-0">
            {/* Minimum Slider Thumb */}
            <input
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
              value={minPrice || SLIDER_MIN}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), Number(maxPrice || SLIDER_MAX));
                handleMinPriceChange(val.toString());
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none accent-orange-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600"
            />
            {/* Maximum Slider Thumb */}
            <input
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
              value={maxPrice || SLIDER_MAX}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), Number(minPrice || SLIDER_MIN));
                handleMaxPriceChange(val.toString());
              }}
              className="absolute w-full appearance-none bg-transparent pointer-events-none accent-orange-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600"
            />
          </div>

          <div className="flex justify-between text-xs font-bold text-gray-400 pt-3">
            <span>Rs. {SLIDER_MIN}</span>
            <span>Rs. {SLIDER_MAX.toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Restaurants Accordion with Dynamic List and ID selection */}
      {restaurantsList?.length > 0 && 
      <FilterSection
        title="Restaurants"
        isOpen={openSection === "rest"}
        onToggle={() =>
          setOpenSection(openSection === "rest" ? null : "rest")
        }
      >
        {restaurantsList.map((r, i) => {
          const restaurantId = r?.id?.toString() || "";
          const isChecked = selectedRestaurants.includes(restaurantId);

          return (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleRestaurantToggle(restaurantId)}
                className="w-5 h-5 rounded-md accent-orange-600 cursor-pointer"
              />
              <span className="text-gray-600">{r?.name}</span>
            </label>
          );
        })}
      </FilterSection>
      }

      {/* Categories Accordion with Dynamic List and ID selection */}
      {categoriesFilterData?.length > 0 && 
      <FilterSection
        title="Categories"
        isOpen={openSection === "cat"}
        onToggle={() =>
          setOpenSection(openSection === "cat" ? null : "cat")
        }
      >
        {categoriesFilterData.map((c, i) => {
          const categoryId = c?.id?.toString() || "";
          const isChecked = selectedCategories.includes(categoryId);

          return (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCategoryToggle(categoryId)}
                className="w-5 h-5 rounded-md accent-orange-600 cursor-pointer"
              />
              <span className="text-gray-600">{c?.title}</span>
            </label>
          );
        })}
      </FilterSection>
      }

      {/* Other Filters Accordion */}
      <FilterSection
        title="Other Filters"
        isOpen={openSection === "other"}
        onToggle={() =>
          setOpenSection(openSection === "other" ? null : "other")
        }
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isOnSaleParam}
            onChange={handleOnSaleToggle}
            className="w-5 h-5 rounded-md accent-orange-600 cursor-pointer"
          />
          <span className="text-gray-600 font-bold">On Sale</span>
        </label>
      </FilterSection>
    </>
  );

  return (
    <div className="w-full bg-gray-100 relative min-h-screen pb-24 md:pb-0">
      <Categories />
      {/* Expanded Max Width container for wider desktop layouts */}
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl font-black text-gray-950">Explore Foods</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search delicious..."
                className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-80 bg-white shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden md:block w-80 min-w-[20rem] flex-shrink-0">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden sticky top-6">
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Modal Drawer */}
          {isFilterModalOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={() => setIsFilterModalOpen(false)}
              />
              {/* Sliding Drawer */}
              <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
                  <span className="font-black text-xl text-gray-950">Filters</span>
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 flex-grow">
                  <FilterContent />
                </div>
                <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white z-20">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-colors cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right: Modern Product Grid & Pagination */}
          <main className="flex-grow flex flex-col justify-between">
            <div>
              {isPending ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                    <div key={n} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 h-80 animate-pulse" />
                  ))}
                </div>
              ) : foodItems?.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <UtensilsCrossed size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-950 mb-1">No food items found</h3>
                    <p className="text-xs font-semibold text-gray-400">Try searching for something else or check back later.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                  {foodItems.map((item, i) => {
                    const isOnSale = item?.is_on_sale === 1;
                    const regPrice = Number(item?.regular_price) || 0;
                    const salePrice = Number(item?.sale_price) || 0;
                    
                    const hasValidDiscount = isOnSale && regPrice > salePrice && salePrice > 0;
                    const discountPercentage = hasValidDiscount 
                      ? Math.round(((regPrice - salePrice) / regPrice) * 100)
                      : 0;

                    const handleProductClick = () => {
                      const categorySlug = slugify(item?.category?.title || "general");
                      const productSlug = slugify(item?.title || "product");
                      const productId = item?.id;
                      navigate(`/food-item/${categorySlug}/${productSlug}/${productId}`);
                    };

                    return (
                      <div
                        key={i}
                        onClick={handleProductClick}
                        className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 relative flex flex-col justify-between cursor-pointer"
                      >
                        {hasValidDiscount && (
                          <span className="absolute top-8 left-8 z-10 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {discountPercentage}% OFF
                          </span>
                        )}

                        <div>
                          <div className="aspect-square bg-gray-100 rounded-[2rem] mb-5 overflow-hidden">
                            <img
                              src={
                                item?.image?.media_path
                                  ? `${import.meta.env.VITE_API_BASE_URL}/storage/${item?.image?.media_path}`
                                  : no_image
                              }
                              alt="Product"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <h3 className="font-black text-lg mb-4 text-gray-950 truncate">
                            {item?.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            {hasValidDiscount ? (
                              <>
                                <span className="text-xl font-black text-orange-600">
                                  Rs. {item?.sale_price}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  Rs. {item?.regular_price}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-black text-orange-600">
                                Rs. {item?.regular_price}
                              </span>
                            )}
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart or handle add action here if needed
                            }}
                            className="bg-gray-950 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Component Integration */}
            {foodItems?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalEntries={totalEntries}
                from={from}
                to={to}
                entriesPerPage={entriesPerPage}
                onPageChange={handlePageChange}
                onEntriesPerPageChange={handleEntriesPerPageChange}
              />
            )}
          </main>
        </div>
      </div>

      {/* Fixed Bottom Center Filter Button for Mobile View */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="group flex items-center gap-2 bg-gray-950 text-white hover:text-white px-6 py-3.5 rounded-full font-bold shadow-2xl shadow-gray-950/40 hover:bg-orange-600 transition-all cursor-pointer whitespace-nowrap"
        >
          <SlidersHorizontal size={18} className="text-orange-500 group-hover:text-white transition-colors" />
          Filters
        </button>
      </div>
    </div>
  );
};