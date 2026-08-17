import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  PackageOpen,
} from "lucide-react";

import { useDashboard } from "../../hooks/admin/useDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  // =====================================================
  // DASHBOARD API
  // =====================================================
  const navigate= useNavigate();
  const {
    data: response,
    isPending,
    isFetching,
    isError,
    error,
  } = useDashboard();

  // =====================================================
  // API DATA
  // =====================================================

  const summary = response?.summary;

  const recentOrders =
    response?.recent_orders ?? [];

  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          className:
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };

      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          className:
            "bg-amber-500/10 text-amber-600 border-amber-500/20",
        };

      case "confirmed":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          className:
            "bg-blue-500/10 text-blue-600 border-blue-500/20",
        };

      case "preparing":
        return {
          label: "Preparing",
          icon: Clock,
          className:
            "bg-blue-500/10 text-blue-600 border-blue-500/20",
        };

      case "ready_for_pickup":
        return {
          label: "Ready for Pickup",
          icon: CheckCircle2,
          className:
            "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        };

      case "out_for_delivery":
        return {
          label: "Out for Delivery",
          icon: TrendingUp,
          className:
            "bg-purple-500/10 text-purple-600 border-purple-500/20",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          className:
            "bg-red-500/10 text-red-600 border-red-500/20",
        };

      default:
        return {
          label: status
            ? status.replaceAll("_", " ")
            : "Unknown",
          icon: Clock,
          className:
            "bg-gray-500/10 text-gray-600 border-gray-500/20",
        };
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Revenue",

      value: `Rs. ${Number(
        summary?.total_revenue ?? 0
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      change: "Live",

      isPositive: true,

      icon: DollarSign,

      color:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
    },

    {
      title: "Total Orders",

      value: Number(
        summary?.total_orders ?? 0
      ).toLocaleString(),

      change: "Live",

      isPositive: true,

      icon: ShoppingBag,

      color:
        "bg-orange-500/10 text-orange-600 border-orange-500/10",
    },

    {
      title: "Active Restaurants",

      value: Number(
        summary?.active_restaurants ?? 0
      ).toLocaleString(),

      change: "Live",

      isPositive: true,

      icon: UtensilsCrossed,

      color:
        "bg-blue-500/10 text-blue-600 border-blue-500/10",
    },

    {
      title: "Completed Orders",

      value: Number(
        summary?.completed_orders ?? 0
      ).toLocaleString(),

      change: "Live",

      isPositive: true,

      icon: CheckCircle2,

      color:
        "bg-purple-500/10 text-purple-600 border-purple-500/10",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
        <div className="space-y-8 animate-pulse">

          {/* Header */}

          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-7 w-56 bg-gray-200 rounded-lg" />
              <div className="h-4 w-80 bg-gray-100 rounded-lg" />
            </div>

            <div className="h-9 w-28 bg-gray-100 rounded-xl" />
          </div>

          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 bg-gray-100 rounded-2xl"
              />
            ))}
          </div>

          {/* Content */}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl" />
            <div className="h-96 bg-gray-100 rounded-2xl" />
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full flex items-center justify-center">

        <div className="text-center">

          <XCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-lg font-black text-gray-900">
            Failed to load dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading dashboard data."}
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">

      <div className="space-y-8 animate-in fade-in duration-300">

        {/* =====================================================
            1. HEADER
        ===================================================== */}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
              Dashboard Overview
            </h1>

            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              Real-time platform logs, analytical insights, and
              operational metrics.
            </p>

          </div>

          {/* LIVE DATA */}

          <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-[11px] font-bold text-gray-500">

            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />

            <span>
              {isFetching
                ? "Updating..."
                : "Live Data Feed"}
            </span>

          </div>

        </div>

        {/* =====================================================
            2. STATS
        ===================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat, idx) => {

            const Icon = stat.icon;

            return (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">
                    {stat.title}
                  </span>

                  <div
                    className={`p-2.5 rounded-xl border ${stat.color} transition-transform group-hover:scale-105 duration-300`}
                  >

                    <Icon className="w-4.5 h-4.5" />

                  </div>

                </div>

                <div className="mt-4 flex items-end justify-between">

                  <div>

                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                      {stat.value}
                    </span>

                  </div>

                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-black border bg-emerald-500/5 text-emerald-600 border-emerald-500/10">

                    <ArrowUpRight className="w-3 h-3" />

                    <span>
                      {stat.change}
                    </span>

                  </div>

                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              </div>
            );
          })}

        </div>

        {/* =====================================================
            3. MAIN CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =====================================================
              RECENT ORDERS
          ===================================================== */}

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden flex flex-col">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-sm font-black text-gray-800">
                  Recent System Orders
                </h2>

                <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                  Latest orders received by the platform.
                </p>

              </div>

              <button
              onClick={()=> navigate('/admin/orders')}
                type="button"
                className="flex items-center gap-1 text-[11px] font-black text-orange-500 hover:text-orange-600 transition-colors cursor-pointer group"
              >

                <span>
                  View All Orders
                </span>

                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />

              </button>

            </div>

            {/* TABLE */}

            <div className="flex-1 overflow-x-auto custom-scrollbar">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-black tracking-widest text-gray-400 uppercase">

                    <th className="px-6 py-3.5">
                      Order ID
                    </th>

                    <th className="px-6 py-3.5">
                      Customer
                    </th>

                    <th className="px-6 py-3.5">
                      Restaurant
                    </th>

                    <th className="px-6 py-3.5">
                      Total Amount
                    </th>

                    <th className="px-6 py-3.5">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">

                  {recentOrders.length > 0 ? (

                    recentOrders.map(
                      (order, idx) => {

                        const statusConfig =
                          getStatusConfig(
                            order.status
                          );

                        const StatusIcon =
                          statusConfig.icon;

                        return (
                          <tr
                            key={
                              order.id ??
                              idx
                            }
                            className="hover:bg-gray-50/40 transition-colors group"
                          >

                            {/* ORDER */}

                            <td className="px-6 py-4 font-black text-gray-900 group-hover:text-orange-500 transition-colors whitespace-nowrap">

                              {order.order_number}

                            </td>

                            {/* CUSTOMER */}

                            <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">

                              {order.customer ||
                                "N/A"}

                            </td>

                            {/* RESTAURANT */}

                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">

                              {order.restaurant ||
                                "N/A"}

                            </td>

                            {/* AMOUNT */}

                            <td className="px-6 py-4 font-extrabold text-gray-900 whitespace-nowrap">

                              Rs.{" "}

                              {Number(
                                order.amount ??
                                  0
                              ).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-4 whitespace-nowrap">

                              <div
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConfig.className}`}
                              >

                                <StatusIcon className="w-3 h-3 shrink-0" />

                                <span>
                                  {
                                    statusConfig.label
                                  }
                                </span>

                              </div>

                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-4 text-center">

                              <button
                              onClick={()=> navigate(`/admin/order/${order?.id}`)}
                                type="button"
                                className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-500/30 bg-white transition-all cursor-pointer active:scale-95"
                              >

                                <Eye className="w-3.5 h-3.5" />

                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-16 text-center"
                      >

                        <PackageOpen
                          size={32}
                          className="mx-auto text-gray-300 mb-2"
                        />

                        <p className="text-sm font-bold text-gray-500">
                          No recent orders found
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          There are no recent orders available.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =====================================================
              ORDER STATUS SUMMARY
          ===================================================== */}

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">

            <div className="px-6 py-5 border-b border-gray-100">

              <h2 className="text-sm font-black text-gray-800">
                Order Status Overview
              </h2>

              <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                Current platform order distribution.
              </p>

            </div>

            <div className="p-5 space-y-3">

              {/* COMPLETED */}

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">

                    <CheckCircle2
                      size={17}
                    />

                  </div>

                  <div>

                    <p className="text-xs font-black text-gray-800">
                      Completed
                    </p>

                    <p className="text-[10px] text-gray-400 font-semibold">
                      Successfully delivered
                    </p>

                  </div>

                </div>

                <span className="text-lg font-black text-emerald-600">

                  {response?.status_counts
                    ?.completed ?? 0}

                </span>

              </div>

              {/* PENDING */}

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">

                    <Clock size={17} />

                  </div>

                  <div>

                    <p className="text-xs font-black text-gray-800">
                      Pending
                    </p>

                    <p className="text-[10px] text-gray-400 font-semibold">
                      Awaiting processing
                    </p>

                  </div>

                </div>

                <span className="text-lg font-black text-amber-600">

                  {response?.status_counts
                    ?.pending ?? 0}

                </span>

              </div>

              {/* CANCELLED */}

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">

                    <XCircle size={17} />

                  </div>

                  <div>

                    <p className="text-xs font-black text-gray-800">
                      Cancelled
                    </p>

                    <p className="text-[10px] text-gray-400 font-semibold">
                      Cancelled orders
                    </p>

                  </div>

                </div>

                <span className="text-lg font-black text-red-600">

                  {response?.status_counts
                    ?.cancelled ?? 0}

                </span>

              </div>

              {/* OTHER ACTIVE */}

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">

                <div className="flex items-center gap-3">

                  <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">

                    <TrendingUp size={17} />

                  </div>

                  <div>

                    <p className="text-xs font-black text-gray-800">
                      Active Processing
                    </p>

                    <p className="text-[10px] text-gray-400 font-semibold">
                      Orders in progress
                    </p>

                  </div>

                </div>

                <span className="text-lg font-black text-blue-600">

                  {Number(
                    response?.status_counts
                      ?.confirmed ?? 0
                  ) +
                    Number(
                      response?.status_counts
                        ?.preparing ?? 0
                    ) +
                    Number(
                      response?.status_counts
                        ?.ready_for_pickup ?? 0
                    ) +
                    Number(
                      response?.status_counts
                        ?.out_for_delivery ?? 0
                    )}

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;