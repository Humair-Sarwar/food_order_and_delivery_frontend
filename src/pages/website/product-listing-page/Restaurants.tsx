import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Mail, Building2, ChevronRight, Ban, Store } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import no_image from "../../../assets/images/empty-image.jpg";
import { useAllRestaurantsListing } from "../../../hooks/website/useRestaurants";
import Pagination from "../../../components/common/Pagination";

export const Restaurants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const searchQueryParam = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const perPageParam = Number(searchParams.get("per_page")) || 10;

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [entriesPerPage, setEntriesPerPage] = useState(perPageParam);

  // Fetch restaurants data using custom hook
  const { data, isPending } = useAllRestaurantsListing();

  const restaurantsList = data?.data ?? [];

  // Filter restaurants locally based on name, address, phone, email, or city
  const filteredRestaurants = restaurantsList.filter((restaurant: any) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = restaurant?.name?.toLowerCase().includes(query);
    const addressMatch = restaurant?.address?.toLowerCase().includes(query);
    const phoneMatch = restaurant?.phone?.toString().toLowerCase().includes(query);
    const emailMatch = restaurant?.email?.toLowerCase().includes(query);
    const cityMatch = restaurant?.city?.toLowerCase().includes(query);
    
    return nameMatch || addressMatch || phoneMatch || emailMatch || cityMatch;
  });

  // Pagination calculation
  const totalEntries = filteredRestaurants.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  
  // Safe page clamp
  const validCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validCurrentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  // Sync state with URL parameters
  useEffect(() => {
    setSearchQuery(searchQueryParam);
    setCurrentPage(pageParam);
    setEntriesPerPage(perPageParam);
  }, [searchQueryParam, pageParam, perPageParam]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value.trim()) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEntriesPerPageChange = (newEntries: number) => {
    setEntriesPerPage(newEntries);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("per_page", newEntries.toString());
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleViewMenu = (restaurantId: string) => {
    navigate(`/food-items/All?restaurant=${restaurantId}&page=1`);
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Header: Title on Left, Search Filter on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Explore Restaurants
          </h1>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search restaurant, city, email..."
                className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none w-full sm:w-80 bg-white shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        {/* Restaurants Content Grid */}
        <div>
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="bg-white p-5 rounded-[2.5rem] border border-gray-100 h-80 animate-pulse"
                />
              ))}
            </div>
          ) : currentRestaurants.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Store size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-950 mb-1">No restaurants found</h3>
                    <p className="text-xs sm:text-sm font-semibold text-gray-400">Try searching for a different name, city, or email.</p>
                </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentRestaurants.map((restaurant: any, i: number) => {
                  const isInactive = restaurant?.status === "inactive" || restaurant?.deleted_at !== null;

                  return (
                    <div
                      key={restaurant?.id || i}
                      onClick={() => handleViewMenu(restaurant?.id)}
                      className="group bg-white p-5 rounded-[2.5rem] border border-orange-200 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 relative flex flex-col justify-between cursor-pointer"
                    >
                      <div className="min-w-0">
                        {/* Cover Banner & Floating Logo Layout */}
                        <div className="relative mb-8">
                          {/* Banner Image */}
                          <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden relative">
                            <img
                              src={
                                restaurant?.banner?.media_path
                                  ? `${import.meta.env.VITE_API_BASE_URL}/storage/${restaurant?.banner?.media_path}`
                                  : no_image
                              }
                              alt={restaurant?.name || "Banner"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Status Badge */}
                          {isInactive && (
                            <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm text-white z-10">
                              <Ban size={12} />
                              <span className="text-xs font-bold">Inactive</span>
                            </div>
                          )}

                          {/* Floating Logo Overlay */}
                          <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-white p-1 border-2 border-white shadow-md overflow-hidden z-10 flex-shrink-0">
                            <img
                              src={
                                restaurant?.logo?.media_path
                                  ? `${import.meta.env.VITE_API_BASE_URL}/storage/${restaurant?.logo?.media_path}`
                                  : no_image
                              }
                              alt={restaurant?.name || "Logo"}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Restaurant Name */}
                        <h3 className="font-black text-xl mb-2 text-gray-950 truncate block w-full">
                          {restaurant?.name}
                        </h3>

                        {/* Description */}
                        {restaurant?.description && restaurant?.description !== "NULL" && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {restaurant.description}
                          </p>
                        )}
                        
                        {/* City */}
                        {restaurant?.city && restaurant?.city !== "NULL" && (
                          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-2 min-w-0">
                            <Building2 size={14} className="text-orange-600 flex-shrink-0" />
                            <span className="truncate">{restaurant.city}</span>
                          </div>
                        )}

                        {/* Address */}
                        {restaurant?.address && restaurant?.address !== "NULL" && (
                          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-2 min-w-0">
                            <MapPin size={14} className="text-orange-600 flex-shrink-0" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                        )}

                        {/* Phone */}
                        {restaurant?.phone && restaurant?.phone !== "NULL" && (
                          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-2 min-w-0">
                            <Phone size={14} className="text-orange-600 flex-shrink-0" />
                            <span className="truncate">{restaurant.phone}</span>
                          </div>
                        )}

                        {/* Email */}
                        {restaurant?.email && restaurant?.email !== "NULL" && (
                          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-2 min-w-0">
                            <Mail size={14} className="text-orange-600 flex-shrink-0" />
                            <span className="truncate">{restaurant.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Action / Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl">
                          View Menu
                        </span>
                        <div className="w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors flex-shrink-0">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reusable Pagination Component Integration */}
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                totalEntries={totalEntries}
                from={totalEntries > 0 ? startIndex + 1 : 0}
                to={endIndex}
                entriesPerPage={entriesPerPage}
                onPageChange={handlePageChange}
                onEntriesPerPageChange={handleEntriesPerPageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;