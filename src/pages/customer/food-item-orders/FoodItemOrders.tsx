import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  Search,
} from "lucide-react";

export const FoodItemOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy orders data - aap isay apni API/backend data se replace kar sakte hain
  const orders = [
    {
      id: "ORD-9842",
      date: "Aug 10, 2026",
      itemsCount: 3,
      totalAmount: 2450,
      status: "Delivered",
      restaurant: "Spicy Treats",
      items: ["Zinger Burger", "French Fries", "Cold Drink"],
    },
    {
      id: "ORD-9843",
      date: "Aug 12, 2026",
      itemsCount: 2,
      totalAmount: 1800,
      status: "Processing",
      restaurant: "Cheezious",
      items: ["Chicken Supreme Pizza", "Garlic Bread"],
    },
    {
      id: "ORD-9840",
      date: "Aug 05, 2026",
      itemsCount: 1,
      totalAmount: 950,
      status: "Cancelled",
      restaurant: "KFC",
      items: ["Hot Wings Bucket"],
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full w-fit">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full w-fit">
            <Clock size={14} /> Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full w-fit">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-950">Food Item Orders</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Track and manage your recent food orders
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search order ID or restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-gray-50/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["All", "Processing", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.toLowerCase()
                ? "bg-gray-950 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50/50 p-12 rounded-[2rem] border border-gray-100 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="font-black text-gray-950 text-base">No orders found</h3>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              You haven't placed any orders matching this filter yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-950 text-base">
                    {order.id}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold text-gray-400">
                    {order.date}
                  </span>
                </div>

                <div className="text-sm font-semibold text-gray-600">
                  <span className="text-orange-600 font-bold">{order.restaurant}</span> —{" "}
                  {order.items.join(", ")}
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-gray-400 font-semibold block">Total Amount</span>
                  <span className="text-lg font-black text-gray-950">
                    Rs. {order.totalAmount}
                  </span>
                </div>

                <button
                  onClick={() => console.log("View details for order:", order.id)}
                  className="flex items-center gap-2 bg-gray-950 text-white hover:bg-orange-600 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-sm"
                >
                  <Eye size={16} /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodItemOrders;