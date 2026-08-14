import React, { useState, useEffect } from 'react';
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
  Calendar
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminOrderDetails } from '../../../hooks/admin/useOrder';
import no_image from "../../../assets/images/empty-image.jpg";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: responseData,
    isPending,
    isError,
    error,
  } = useAdminOrderDetails({
    order_id: id ?? "",
  });

  // Extract the order object from API response structure
  const order: any = responseData?.data;

  const [orderStatus, setOrderStatus] = useState('pending');
  const [isSaving, setIsSaving] = useState(false);

  // Sync local status when API data loads
  useEffect(() => {
    if (order?.status) {
      setOrderStatus(order.status);
    }
  }, [order?.status]);

  const handleSaveStatus = () => {
    setIsSaving(true);
    // TODO: Hook up your status mutation update function here
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          Loading order details...
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
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
        
        {/* TOP NAVIGATION / HEADER */}
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
                Manage order fulfillment, tracking, and customer records for {order?.restaurant?.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold shadow-2xs capitalize">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {order?.status || 'Pending'}
            </span>
          </div>
        </div>

        {/* TOP METADATA CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Identifier</span>
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-950">#{order?.order_number}</span>
              <Package size={16} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Status</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 capitalize">{order?.status}</span>
              <ShieldCheck size={16} className="text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placed On</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {order?.created_at ? new Date(order.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </span>
              <Calendar size={16} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1 truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Restaurant Email</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 truncate">{order?.restaurant?.email || 'N/A'}</span>
              <Mail size={16} className="text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* STATUS CONTROLLER & PRODUCTS CONTAINER */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-8">
          
          {/* Status Update Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Update Order Status Flow
              </label>
              <div className="relative">
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer shadow-2xs capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="sm:self-end">
              <button
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-7 py-3 rounded-xl text-xs transition-all shadow-sm hover:shadow cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* PRODUCTS LIST GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Order Items Breakdown
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {order?.items?.length || 0} Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order?.items?.map((item: any) => (
                <div 
                  key={item.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/30 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {item.food_item?.image?.media_path ? (
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.food_item.image.media_path}`} 
                          alt={item.food_item_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to text indicator if image fails to load
                            const target = e.target as HTMLElement;
                            const parent = target.parentElement;
                            if (parent) {
                              target.style.display = 'none';
                              const fallbackDiv = document.createElement('span');
                              fallbackDiv.className = 'text-[10px] font-bold text-slate-400 uppercase tracking-wider';
                              fallbackDiv.innerText = 'no_image';
                              parent.appendChild(fallbackDiv);
                            }
                          }}
                        />
                      ) : (
                        <img 
                          src={no_image} 
                          
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {item.food_item_name}
                      </h4>
                      <div className="inline-block bg-purple-50 text-orange-700 border border-orange-100 text-[10px] font-black px-2.5 py-0.5 rounded-md">
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

          {/* ACTION BUTTONS (Contact & Delivery Time) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <button className="flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-98">
              <MessageSquare size={16} className="text-orange-400" />
              <span>Contact Restaurant ({order?.restaurant?.phone})</span>
            </button>

            <div className="flex items-center justify-center gap-2.5 bg-amber-400/90 text-slate-950 px-6 py-4 rounded-2xl font-black text-xs shadow-xs">
              <Clock size={16} />
              <span>Fulfillment Type: {order?.delivery_method?.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: SHIPPING & FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Shipping / Address Details */}
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Fulfillment Method
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 inline-flex items-center gap-1.5 capitalize">
                  <Truck size={14} className="text-slate-500" />
                  {order?.delivery_method?.replace('_', ' ')}
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

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs font-semibold text-slate-700 space-y-1">
                {order?.address ? (
                  <>
                    <p className="font-black text-slate-950 text-sm">{order.first_name} {order.last_name}</p>
                    <p className="font-medium text-slate-500">{order.phone}</p>
                    <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-200/50 mt-2">
                      {order.apartment ? `${order.apartment}, ` : ''}{order.address}, {order.city}, {order.country} {order.postcode}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500 italic">No direct shipping address provided (Self Pickup or digital order record).</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
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
                <span className="font-black text-slate-900 text-sm">PKR {Number(order?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">PKR {Number(order?.delivery_fee || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 text-sm">Total</span>
                <span className="font-black text-slate-950 text-lg">PKR {Number(order?.total || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Payment Method</span>
                <span className="font-black text-slate-950 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs uppercase">
                  {order?.payment_method} ({order?.payment_status})
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