import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  Clock,
  MessageSquare,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  MapPin,
  Truck,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  ChefHat,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useAdminOrderDetails,
  useAdminOrderStatusUpdate,
} from "../../../hooks/admin/useOrder";

import no_image from "../../../assets/images/empty-image.jpg";

// =====================================================
// TYPES
// =====================================================

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

type DeliveryMethod = "self_pickup" | "ship";

interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;

  food_item_name?: string;

  unit_price: number | string;
  quantity: number;
  item_total: number | string;

  food_item?: {
    id: string;
    title: string;
    slug?: string;

    image?: {
      id: string;
      media_path: string;
    } | null;

    category?: {
      id: string;
      title: string;
    } | null;
  } | null;
}

interface OrderDetail {
  id: string;
  order_number: string;

  status: OrderStatus;

  payment_status: string;
  payment_method: string;

  delivery_method: DeliveryMethod;

  first_name?: string | null;
  last_name?: string | null;

  address?: string | null;
  apartment?: string | null;
  city?: string | null;
  postcode?: string | null;
  phone?: string | null;
  country?: string | null;

  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;

  created_at?: string;
  updated_at?: string;

  customer?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;

  restaurant?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    slug?: string;
  } | null;

  items?: OrderItem[];
}

// =====================================================
// STATUS LABELS
// =====================================================

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready For Pickup",
  out_for_delivery: "Out For Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

// =====================================================
// STATUS FLOW
// =====================================================

const statusFlow: Record<DeliveryMethod, OrderStatus[]> = {
  // SELF PICKUP
  self_pickup: [
    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "completed",
  ],

  // DELIVERY / SHIP
  ship: [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "completed",
  ],
};

// =====================================================
// COMPONENT
// =====================================================

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  // ===================================================
  // ORDER DETAILS
  // ===================================================

  const {
    data: responseData,
    isPending,
    isError,
    error,
  } = useAdminOrderDetails({
    order_id: id ?? "",
  });

  const order = responseData?.data as OrderDetail | undefined;
  const isSelfPickup = order?.delivery_method === 'self_pickup';

  // Helper to map order status configuration (badge style, title, message banner)
  const getStatusConfig = (status: string, isPickup: boolean) => {
    switch (status) {
      case 'confirmed':
        return {
          badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
          dotBg: 'bg-blue-500',
          bannerBg: 'bg-blue-600',
          message: 'This order has been confirmed and is queued for kitchen preparation.',
        };
      case 'preparing':
        return {
          badgeBg: 'bg-orange-50 border-orange-200 text-orange-700',
          dotBg: 'bg-orange-500',
          bannerBg: 'bg-orange-600',
          message: 'The kitchen is actively preparing items for this order.',
        };
      case 'ready_for_pickup':
        return {
          badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
          dotBg: 'bg-purple-500',
          bannerBg: 'bg-purple-600',
          message: 'Order is fully prepared and ready for customer pickup.',
        };
      case 'out_for_delivery':
        return {
          badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          dotBg: 'bg-indigo-500',
          bannerBg: 'bg-indigo-600',
          message: 'Order is currently out for delivery with the assigned rider.',
        };
      case 'completed':
        return {
          badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dotBg: 'bg-emerald-500',
          bannerBg: 'bg-emerald-600',
          message: isPickup ? 'This order has been successfully picked up.' : 'This order has been successfully delivered.',
        };
      case 'cancelled':
        return {
          badgeBg: 'bg-red-50 border-red-200 text-red-700',
          dotBg: 'bg-red-500',
          bannerBg: 'bg-red-600',
          message: 'This order has been cancelled.',
        };
      case 'pending':
      default:
        return {
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
          dotBg: 'bg-amber-500',
          bannerBg: 'bg-amber-500',
          message: isPickup 
            ? 'Pickup order received, awaiting confirmation and preparation.' 
            : 'New order received, awaiting confirmation.',
        };
    }
  };

  // ===================================================
  // STATUS MUTATION
  // ===================================================

  const {
    mutate: updateOrderStatus,
    isPending: orderUpdatePending,
  } = useAdminOrderStatusUpdate();

  // ===================================================
  // STATUS STATES
  // ===================================================

  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus | "">("");

  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus | "">("");

  // ===================================================
  // SUCCESS / ERROR MESSAGE
  // ===================================================

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ===================================================
  // SYNC API STATUS
  // ===================================================

  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
      setSelectedStatus("");
    }
  }, [order?.id, order?.status]);

  // ===================================================
  // AVAILABLE FLOW
  // ===================================================

  const availableStatuses = useMemo(() => {
    if (!order?.delivery_method) {
      return [];
    }

    return statusFlow[order.delivery_method] ?? [];
  }, [order?.delivery_method]);

  // ===================================================
  // NEXT STATUS
  // ===================================================

  const nextStatuses = useMemo(() => {
    if (!currentStatus) {
      return [];
    }

    const currentIndex =
      availableStatuses.indexOf(currentStatus);

    if (currentIndex === -1) {
      return [];
    }

    return availableStatuses.slice(currentIndex + 1);
  }, [availableStatuses, currentStatus]);

  // ===================================================
  // DROPDOWN OPTIONS
  // ===================================================

  const statusOptions = useMemo(() => {
    const options: OrderStatus[] = [];

    nextStatuses.forEach((status) => {
      if (!options.includes(status)) {
        options.push(status);
      }
    });

    if (
      currentStatus !== "completed" &&
      currentStatus !== "cancelled"
    ) {
      if (!options.includes("cancelled")) {
        options.push("cancelled");
      }
    }

    return options;
  }, [nextStatuses, currentStatus]);

  const canUpdateStatus =
    currentStatus !== "completed" &&
    currentStatus !== "cancelled";

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as OrderStatus;
    setSelectedStatus(value);
    setStatusMessage(null);
  };

  const handleSaveStatus = () => {
    if (!order?.id || !selectedStatus || !canUpdateStatus) {
      return;
    }

    if (!availableStatuses.includes(selectedStatus)) {
      if (selectedStatus !== "cancelled") {
        setStatusMessage({
          type: "error",
          text: "Invalid status for this order type.",
        });
        return;
      }
    }

    if (selectedStatus === currentStatus) {
      return;
    }

    setStatusMessage(null);

    updateOrderStatus(
      {
        order_id: order.id,
        status: selectedStatus,
      },
      {
        onSuccess: (response: any) => {
          if (response?.status === false) {
            setStatusMessage({
              type: "error",
              text: response?.message || "Failed to update order status.",
            });
            return;
          }

          setCurrentStatus(selectedStatus);
          setSelectedStatus("");
          setStatusMessage({
            type: "success",
            text: response?.message || "Order status updated successfully.",
          });
        },
        onError: (mutationError: any) => {
          setStatusMessage({
            type: "error",
            text:
              mutationError?.response?.data?.message ||
              mutationError?.message ||
              "Failed to update order status.",
          });
        },
      }
    );
  };

  const formatStatus = (status?: string) => {
    if (!status) return "N/A";
    if (status in statusLabels) {
      return statusLabels[status as OrderStatus];
    }
    return status.replaceAll("_", " ");
  };

  const formatDeliveryMethod = (method?: string) => {
    if (!method) return "N/A";
    if (method === "self_pickup") return "Self Pickup";
    if (method === "ship") return "Delivery";
    return method.replaceAll("_", " ");
  };

  const getFlowText = () => {
    if (order?.delivery_method === "self_pickup") {
      return "Pending → Confirmed → Preparing → Ready For Pickup → Completed";
    }
    if (order?.delivery_method === "ship") {
      return "Pending → Confirmed → Preparing → Out For Delivery → Completed";
    }
    return "";
  };

  const activeStatusConfig = getStatusConfig(currentStatus, isSelfPickup);

  // ===================================================
  // LOADING SKELETON
  // ===================================================

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans antialiased text-slate-900">
        <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
          
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                <div className="h-3 w-72 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-full" />
          </div>

          {/* Metadata Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="h-2.5 w-24 bg-slate-200 rounded" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 bg-slate-200 rounded" />
                  <div className="h-4 w-4 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Status & Items Section Skeleton */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 space-y-8">
            <div className="h-14 w-full bg-slate-200 rounded-2xl" />
            <div className="h-28 w-full bg-slate-100 rounded-2xl" />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-36 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-20 w-full bg-slate-100 rounded-2xl" />
                <div className="h-20 w-full bg-slate-100 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Bottom Grid Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 space-y-4">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-28 w-full bg-slate-100 rounded-2xl" />
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 space-y-4">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-28 w-full bg-slate-100 rounded-2xl" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center font-sans p-4">
        <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm text-center space-y-3 max-w-md">
          <p className="text-red-600 font-bold text-sm">Failed to load order details</p>
          <p className="text-xs text-slate-400">{error?.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-bold text-slate-700">Order not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8 font-sans antialiased text-slate-900">
      <div className="space-y-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="h-11 w-11 inline-flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Sale Order Details
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Manage order fulfillment, tracking, and customer records for {order.restaurant?.name || "Restaurant"}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-2xs ${activeStatusConfig.badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${activeStatusConfig.dotBg} ${currentStatus !== 'cancelled' && currentStatus !== 'completed' ? 'animate-pulse' : ''}`} />
              {formatStatus(currentStatus)}
            </span>
          </div>
        </div>

        {/* METADATA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Order Identifier
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-950">
                #{order.order_number}
              </span>
              <Package size={16} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Status
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                {formatStatus(currentStatus)}
              </span>
              <ShieldCheck size={16} className="text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Placed On
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </span>
              <Calendar size={16} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1 truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Restaurant Email
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 truncate">
                {order.restaurant?.email || "N/A"}
              </span>
              <Mail size={16} className="text-slate-400 shrink-0" />
            </div>
          </div>

        </div>

        {/* STATUS + ITEMS */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-8">

          {/* STATUS UPDATE SECTION */}
          <div className="space-y-4">
            
            {/* Admin Status Message Notice Banner */}
            <div className={`${activeStatusConfig.bannerBg} text-white p-4 rounded-2xl flex items-center gap-3 shadow-sm`}>
              {currentStatus === 'cancelled' ? (
                <XCircle size={20} className="shrink-0" />
              ) : currentStatus === 'preparing' ? (
                <ChefHat size={20} className="shrink-0" />
              ) : currentStatus === 'out_for_delivery' || currentStatus === 'ready_for_pickup' ? (
                <Truck size={20} className="shrink-0" />
              ) : currentStatus === 'completed' ? (
                <CheckCircle size={20} className="shrink-0" />
              ) : (
                <Package size={20} className="shrink-0" />
              )}
              <p className="text-xs font-bold">
                {activeStatusConfig.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
              <div className="flex-1 space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Update Order Status
                </label>

                {/* Modern Apple-style Minimalist Dropdown */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    disabled={orderUpdatePending || !canUpdateStatus}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-extrabold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer shadow-2xs disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      Select Next Status
                    </option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row justify-between gap-1">
                  <p className="text-[10px] font-medium text-slate-400">
                    <span className="font-bold">Flow:</span> {getFlowText()}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Current status: <span className="font-bold text-slate-600">{formatStatus(currentStatus)}</span>
                  </p>
                </div>

                {statusMessage && (
                  <div
                    className={`mt-2 px-3.5 py-2 rounded-xl text-[10px] font-bold border ${
                      statusMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}
              </div>

              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={orderUpdatePending || !canUpdateStatus || !selectedStatus}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-xs transition-all shadow-sm hover:shadow cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {orderUpdatePending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

          </div>

          {/* ORDER ITEMS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Order Items Breakdown
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {order.items?.length || 0} Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {item.food_item?.image?.media_path ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.food_item.image.media_path}`}
                          alt={item.food_item_name || item.food_item.title || "Food item"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = no_image;
                          }}
                        />
                      ) : (
                        <img src={no_image} alt="No image" className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {item.food_item_name || item.food_item?.title || "Food Item"}
                      </h4>
                      <div className="inline-block bg-orange-50 text-orange-700 border border-orange-100 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                        PKR {Number(item.unit_price).toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-black text-sm text-slate-950">
                    PKR {Number(item.item_total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <MessageSquare size={16} className="text-orange-400" />
              <span>Contact Restaurant ({order.restaurant?.phone || "N/A"})</span>
            </button>

            <div className="flex items-center justify-center gap-2.5 bg-amber-400/90 text-slate-950 px-6 py-4 rounded-2xl font-black text-xs shadow-xs">
              <Clock size={16} />
              <span>Fulfillment Type: {formatDeliveryMethod(order.delivery_method).toUpperCase()}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FULFILLMENT */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Fulfillment Method
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 inline-flex items-center gap-1.5 capitalize">
                  <Truck size={14} className="text-slate-500" />
                  {formatDeliveryMethod(order.delivery_method)}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Customer / Delivery Address
                </span>
                <MapPin size={14} className="text-orange-500" />
              </div>

              {order.delivery_method === "self_pickup" ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
                  <p className="font-black">Self Pickup Order</p>
                  <p className="mt-1 text-amber-600">Customer will collect the order from the restaurant.</p>
                  <p className="mt-2 font-bold">Restaurant: {order.restaurant?.name || "N/A"}</p>
                </div>
              ) : order.address ? (
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs font-semibold text-slate-700 space-y-1">
                  <p className="font-black text-slate-950 text-sm">
                    {order.first_name} {order.last_name}
                  </p>
                  <p className="font-medium text-slate-500">{order.phone}</p>
                  <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-200/50 mt-2">
                    {order.apartment ? `${order.apartment}, ` : ""}
                    {order.address}, {order.city}, {order.country} {order.postcode}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  No delivery address provided.
                </div>
              )}
            </div>
          </div>

          {/* FINANCIAL */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Total Summary
              </span>
              <CreditCard size={14} className="text-orange-500" />
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-600 border-b border-slate-100 pb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-black text-slate-900 text-sm">
                  PKR {Number(order.subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  PKR {Number(order.delivery_fee || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 text-sm">Total</span>
                <span className="font-black text-slate-950 text-lg">
                  PKR {Number(order.total || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Payment Method</span>
                <span className="font-black text-slate-950 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs uppercase">
                  {order.payment_method} ({order.payment_status})
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;