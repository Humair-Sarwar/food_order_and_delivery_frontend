import React from "react";
import {
  ShoppingBag,
  Heart,
  Clock,
  ArrowUpRight,
  Sparkles,
  Utensils,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useProfileInfo } from "../../../hooks/website/useProfile";
import { useCustomerDashboard } from "../../../hooks/website/useCustomerDashboard";

export const Dashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE
  // =====================================================

  const {
    data: profileResponse,
    isPending: isProfilePending,
  } = useProfileInfo();

  const profile = profileResponse?.data;

  // =====================================================
  // CUSTOMER DASHBOARD
  // =====================================================

  const {
    data: dashboardResponse,
    isPending: isDashboardPending,
    isError: isDashboardError,
    error: dashboardError,
  } = useCustomerDashboard();

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const summary = dashboardResponse?.summary;

  const recentOrders = dashboardResponse?.recent_orders ?? [];

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Orders",
      value: summary?.total_orders ?? 0,
      change: "All your orders",
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      title: "Wishlist Items",
      value: summary?.wishlist_items ?? 0,
      change: "Saved favorites",
      icon: <Heart size={22} />,
      color: "bg-red-50 text-red-500 border-red-100",
    },
    {
      title: "Active Deliveries",
      value: summary?.active_deliveries ?? 0,
      change:
        (summary?.active_deliveries ?? 0) > 0
          ? "On the way"
          : "No active deliveries",
      icon: <Clock size={22} />,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  // =====================================================
  // STATUS HELPER
  // =====================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          className: "bg-green-100 text-green-700",
          icon: <CheckCircle2 size={12} />,
        };

      case "cancelled":
        return {
          className: "bg-red-100 text-red-700",
          icon: <XCircle size={12} />,
        };

      case "confirmed":
      case "preparing":
      case "ready_for_pickup":
      case "out_for_delivery":
        return {
          className: "bg-orange-100 text-orange-700",
          icon: <Clock size={12} />,
        };

      case "pending":
      default:
        return {
          className: "bg-gray-100 text-gray-700",
          icon: <Clock size={12} />,
        };
    }
  };

  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isDashboardPending) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle
              size={32}
              className="animate-spin text-orange-600"
            />

            <p className="text-sm font-bold text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isDashboardError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-black text-gray-900">
            Failed to load dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {dashboardError instanceof Error
              ? dashboardError.message
              : "Something went wrong"}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* =====================================================
          WELCOME BANNER
      ===================================================== */}

      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-orange-950 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">

          <div className="flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit">
            <Sparkles size={14} />
            Welcome Back!
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">

            {isProfilePending ? (
              <div className="w-64 h-10 bg-gray-800 rounded-lg animate-pulse" />
            ) : (
              `${profile?.first_name || ""} ${
                profile?.last_name || ""
              }`.trim() || "Customer"
            )}

          </h1>

          <p className="text-gray-400 text-sm font-medium max-w-md">
            Track your recent food deliveries, check your saved favorites,
            and manage your account details seamlessly.
          </p>
        </div>

        <button
          onClick={() => navigate("/food-items/All")}
          className="relative z-10 flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Utensils size={18} />
          Order Food Now
        </button>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {stats.map((stat, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-all"
          >

            <div className="flex items-center justify-between">

              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                {stat.title}
              </span>

              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.color}`}
              >
                {stat.icon}
              </div>

            </div>

            <div>

              <h3 className="text-3xl font-black text-gray-950">
                {stat.value}
              </h3>

              <p className="text-xs font-bold text-orange-600 mt-1">
                {stat.change}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">

        <div className="flex items-center justify-between pb-4 border-b border-gray-100">

          <div>
            <h3 className="text-lg font-black text-gray-950">
              Recent Orders
            </h3>

            <p className="text-xs font-semibold text-gray-400">
              Your latest food item orders status
            </p>
          </div>

          <button
            onClick={() => navigate("/user/orders")}
            className="flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 cursor-pointer group"
          >
            <span>View All</span>

            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

        </div>

        {/* =====================================================
            NO ORDERS
        ===================================================== */}

        {recentOrders.length === 0 ? (

          <div className="py-12 text-center">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
              <ShoppingBag size={24} />
            </div>

            <h4 className="mt-4 text-sm font-black text-gray-800">
              No Recent Orders
            </h4>

            <p className="text-xs text-gray-400 mt-1">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/food-items/All")}
              className="mt-4 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-black"
            >
              Order Food
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {recentOrders.map((order) => {

              const status = getStatusStyle(order.status);

              return (

                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gray-50/60 border border-gray-100 gap-4 hover:bg-orange-50/30 transition-all"
                >

                  {/* ORDER INFO */}

                  <div className="space-y-1">

                    <div className="flex items-center gap-3 flex-wrap">

                      <span className="font-black text-gray-950 text-sm">
                        {order.order_number}
                      </span>

                      <span className="text-gray-300">
                        •
                      </span>

                      <span className="text-xs font-bold text-gray-400">
                        {order.created_at || "N/A"}
                      </span>

                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                      Restaurant:{" "}
                      <span className="text-orange-600 font-bold">
                        {order.restaurant}
                      </span>
                    </p>

                    <p className="text-xs font-semibold text-gray-400">
                      Item:{" "}
                      <span className="text-gray-600">
                        {order.top_item}
                      </span>
                    </p>

                  </div>

                  {/* ORDER AMOUNT + STATUS */}

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">

                    <div className="text-left sm:text-right">

                      <span className="text-xs font-black text-gray-950 block">
                        Rs. {order.amount}
                      </span>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5 ${status.className}`}
                      >
                        {status.icon}

                        {formatStatus(order.status)}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        navigate(`/user/order/${order?.id}`)
                      }
                      className="bg-white text-gray-950 border border-gray-200 hover:bg-gray-950 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Details
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>
    </div>
  );
};

export default Dashboard;