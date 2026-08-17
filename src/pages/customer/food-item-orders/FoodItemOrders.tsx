import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Store,
} from "lucide-react";
import { useUserOrderLists } from "../../../hooks/website/useOrder";
import { useNavigate } from "react-router-dom";

export const FoodItemOrders = () => {
  // =========================
  // STATES
  // =========================

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  // =========================
  // API PARAMS MAPPING
  // =========================

  const getApiStatusParam = (tab: string) => {
    switch (tab) {
      case "processing":
        return "pending";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return undefined;
    }
  };

  // =========================
  // API
  // =========================

  const {
    data,
    isPending,
    isError,
  } = useUserOrderLists({
    page: currentPage,
    per_page: perPage,
    search: searchQuery || undefined,
    status: getApiStatusParam(activeTab),
  });

  // =========================
  // API DATA
  // =========================
  const navigate = useNavigate();
  const orders = data?.data ?? [];
  const pagination: any = data?.pagination;

  const ordersArray = Array.isArray(orders) ? orders : (orders?.data || []);

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // =========================
  // TAB CHANGE
  // =========================

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";

    switch (normalizedStatus) {
      case "completed":
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600" />
            {normalizedStatus === "completed" ? "Completed" : "Delivered"}
          </span>
        );

      case "pending":
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <Clock size={13} className="text-amber-600 animate-pulse" />
            Processing
          </span>
        );

      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <Clock size={13} className="text-blue-600" />
            Confirmed
          </span>
        );

      case "preparing":
        return (
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <Clock size={13} className="text-orange-600 animate-pulse" />
            Preparing
          </span>
        );

      case "ready_for_pickup":
      case "out_for_delivery":
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <Clock size={13} className="text-purple-600" />
            {normalizedStatus === "ready_for_pickup" ? "Ready For Pickup" : "Out For Delivery"}
          </span>
        );

      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-100/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            <XCircle size={13} className="text-rose-600" />
            Cancelled
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200/60 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            {status}
          </span>
        );
    }
  };

  // =========================
  // VIEW ORDER DETAILS
  // =========================

  const handleViewDetails = (orderId: string) => {
    navigate(`/user/order/${orderId}`);
  };

  // =========================
  // PAGINATION
  // =========================

  const handlePreviousPage = () => {
    if (pagination && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (
      pagination &&
      currentPage < pagination.last_page
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // =========================
  // LOADING (Initial load only)
  // =========================

  if (isPending && !data) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded-lg" />
            <div className="h-4 w-64 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-11 w-full sm:w-80 bg-gray-200 rounded-2xl" />
        </div>

        <div className="flex items-center gap-2 pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 rounded-2xl shrink-0" />
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 w-full bg-gray-100 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
        <div className="pb-6 border-b border-gray-100">
          <h1 className="text-2xl font-black tracking-tight text-gray-950">
            Food Item Orders
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Track and manage your recent food orders
          </p>
        </div>

        <div className="bg-rose-50/30 p-12 rounded-[2.5rem] border border-rose-100/60 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center shadow-xs">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-gray-950 text-base">
              Failed to load orders
            </h3>
            <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto">
              Something went wrong while fetching your order history. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      {/* PAGE TITLE + SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950">
            Food Item Orders
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Track and manage your recent food orders
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            placeholder="Search order ID or restaurant..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200/80 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-sm bg-gray-50/60 font-medium transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { label: "All Orders", value: "all" },
          { label: "Processing", value: "processing" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeTab === tab.value
                ? "bg-gray-950 text-white shadow-md shadow-black/10 scale-[1.02]"
                : "bg-white text-gray-600 border border-gray-200/60 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      {ordersArray.length === 0 ? (
        <div className="bg-gray-50/50 p-16 rounded-[2.5rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-xs">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-gray-950 text-base">
              No orders found
            </h3>
            <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto">
              You haven't placed any orders matching this filter yet. Try changing your search or tab filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersArray.map((order) => (
            <div
              key={order.id}
              className="group bg-gradient-to-br from-white via-white to-gray-50/50 p-6 rounded-[2rem] border border-gray-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:border-gray-300/80 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 font-black text-gray-950 text-sm bg-gray-100/80 px-3 py-1 rounded-xl border border-gray-200/50">
                    <Receipt size={14} className="text-gray-500" />
                    #{order.order_number}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold text-gray-400">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                    <Store size={14} />
                    <span>{order.restaurant?.name ?? "Unknown Restaurant"}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 line-clamp-1">
                    {order.items && order.items.length > 0
                      ? order.items
                          .map(
                            (item) =>
                              `${item.food_item_name ?? item.food_item?.title ?? "Food Item"} × ${item.quantity}`
                          )
                          .join(", ")
                      : "No items listed"}
                  </p>
                </div>

                <div className="pt-1">{getStatusBadge(order.status)}</div>
              </div>

              {/* Right Details & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-lg font-black text-gray-950 tracking-tight">
                    Rs. {Number(order.total).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleViewDetails(order.id)}
                  className="flex items-center gap-2 bg-gray-950 text-white hover:bg-orange-600 px-5 py-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
                >
                  <Eye size={15} />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400">
            Showing{" "}
            <span className="text-gray-950 font-bold">{pagination.from}</span> to{" "}
            <span className="text-gray-950 font-bold">{pagination.to}</span> of{" "}
            <span className="text-gray-950 font-bold">{pagination.total}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: pagination.last_page },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    currentPage === page
                      ? "bg-gray-950 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === pagination.last_page}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemOrders;