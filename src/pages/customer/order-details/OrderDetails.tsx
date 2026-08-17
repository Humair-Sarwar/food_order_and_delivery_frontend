import React from 'react';
import { Package, Truck, CheckCircle, ArrowLeft, Store, Receipt, MapPin, Clock, XCircle, ChefHat } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetails } from '../../../hooks/website/useOrder';
import no_image from "../../../assets/images/empty-image.jpg";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: orderResponse,
    isPending,
    isError,
  } = useOrderDetails(id);

  const order = orderResponse?.data;
  const restaurant = order?.restaurant;
  const items = order?.items || [];
  const isSelfPickup = order?.delivery_method === 'self_pickup';

  // Helper to map order status configuration (badge style, title, description, and timeline step index)
  const getStatusConfig = (status: string, isPickup: boolean) => {
    switch (status) {
      case 'confirmed':
        return {
          stepIndex: 1,
          badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
          dotBg: 'bg-blue-500',
          bannerBg: 'bg-blue-600',
          message: 'Your order has been confirmed by the restaurant and is queued.',
        };
      case 'preparing':
        return {
          stepIndex: 1,
          badgeBg: 'bg-orange-50 border-orange-200 text-orange-700',
          dotBg: 'bg-orange-500',
          bannerBg: 'bg-orange-600',
          message: 'The kitchen is actively preparing your delicious food right now!',
        };
      case 'ready_for_pickup':
        return {
          stepIndex: 2,
          badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
          dotBg: 'bg-purple-500',
          bannerBg: 'bg-purple-600',
          message: 'Your order is ready! You can now head over to the restaurant to pick it up.',
        };
      case 'out_for_delivery':
        return {
          stepIndex: 2,
          badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          dotBg: 'bg-indigo-500',
          bannerBg: 'bg-indigo-600',
          message: 'Your order is on the way with our delivery rider!',
        };
      case 'completed':
        return {
          stepIndex: 3,
          badgeBg: 'bg-emerald-50 border-green-600 text-emerald-700',
          dotBg: 'bg-emerald-500',
          bannerBg: 'bg-emerald-600',
          message: isPickup ? 'Your order has been successfully picked up. Enjoy your meal!' : 'Your order has been successfully delivered. Enjoy your meal!',
        };
      case 'cancelled':
        return {
          stepIndex: 0,
          badgeBg: 'bg-red-50 border-red-200 text-red-700',
          dotBg: 'bg-red-500',
          bannerBg: 'bg-red-600',
          message: 'This order has been cancelled.',
        };
      case 'pending':
      default:
        return {
          stepIndex: 1,
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
          dotBg: 'bg-amber-500',
          bannerBg: 'bg-amber-500',
          message: isPickup 
            ? 'Your pickup order has been received and is awaiting preparation.' 
            : 'Your order has been received and is pending confirmation.',
        };
    }
  };

  const currentStatus = order?.status || 'pending';
  const statusConfig = getStatusConfig(currentStatus, isSelfPickup);

  // Skeleton Loading State
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-200" />
              <div className="w-36 h-7 bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Section 1 Skeleton */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <div className="space-y-2">
                <div className="w-20 h-3 bg-gray-200 rounded-md" />
                <div className="w-48 h-5 bg-gray-200 rounded-lg" />
              </div>
              <div className="w-20 h-7 bg-gray-200 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="h-16 bg-gray-100 rounded-2xl" />
              <div className="h-16 bg-gray-100 rounded-2xl" />
              <div className="h-16 bg-gray-100 rounded-2xl" />
            </div>
            <div className="h-14 bg-gray-100 rounded-2xl" />
            <div className="h-20 bg-gray-100 rounded-2xl" />
          </div>

          {/* Section 2 Skeleton */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded-md" />
                <div className="w-32 h-3 bg-gray-200 rounded-md" />
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-24 bg-gray-100 rounded-3xl" />
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="h-5 bg-gray-100 rounded-md w-full" />
              <div className="h-5 bg-gray-100 rounded-md w-full" />
              <div className="h-7 bg-gray-100 rounded-md w-full" />
            </div>
          </div>

          {/* Section 3 Skeleton */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-7 border border-gray-100 shadow-xs flex justify-between items-center">
            <div className="space-y-2">
              <div className="w-48 h-4 bg-gray-200 rounded-md" />
              <div className="w-32 h-3 bg-gray-200 rounded-md" />
            </div>
            <div className="w-28 h-10 bg-gray-200 rounded-2xl" />
          </div>

          {/* Section 4 Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xs h-64" />
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xs h-64" />
          </div>

        </div>
      </div>
    );
  }

  // Error State
  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-lg font-black text-gray-950">Failed to load order details</h2>
        <p className="text-xs text-gray-500 font-medium">Please check your connection or try again later.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-2xl bg-gray-950 text-white text-xs font-extrabold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 rounded-3xl sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Back & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Order Details</h1>
          </div>
        </div>

        {/* Section 1: Your Order Status & Timeline */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">YOUR ORDER</span>
              <h2 className="text-sm font-extrabold text-gray-950 mt-0.5">
                {order.order_number} {restaurant ? `- ${restaurant.name}` : ''}
              </h2>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border w-fit capitalize ${statusConfig.badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotBg} ${currentStatus !== 'cancelled' && currentStatus !== 'completed' ? 'animate-pulse' : ''}`} /> 
              {currentStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Timestamp Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Placed on</span>
              <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                {order?.created_at 
                  ? new Date(order.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : 'N/A'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Last updated</span>
              <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                {order?.updated_at 
                  ? new Date(order.updated_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : 'N/A'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isSelfPickup ? 'Ready by (Est.)' : 'Estimated delivery'}
              </span>
              <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                {order?.created_at 
                  ? new Date(new Date(order.created_at).getTime() + 45 * 60 * 1000).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Status Message Banner Notice */}
          <div className={`${statusConfig.bannerBg} text-white p-4 rounded-2xl flex items-center gap-3 shadow-sm`}>
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
              {statusConfig.message}
            </p>
          </div>

          {/* Progress Timeline */}
          {currentStatus !== 'cancelled' && (
            <div className="relative pt-6 pb-2 px-6">
              <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 bg-gray-200 z-0" />
              <div className="relative z-10 flex justify-between items-center">
                
                {/* Step 1: Placed */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                    statusConfig.stepIndex >= 1 ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Package size={22} />
                  </div>
                  <span className={`text-[11px] mt-2 ${statusConfig.stepIndex >= 1 ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>
                    Order Placed
                  </span>
                </div>

                {/* Step 2: Processing / Preparing / Shipped / Ready */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                    statusConfig.stepIndex >= 2 ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStatus === 'preparing' ? <ChefHat size={22} /> : <Truck size={22} />}
                  </div>
                  <span className={`text-[11px] mt-2 ${statusConfig.stepIndex >= 2 ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>
                    {isSelfPickup ? 'Ready for Pickup' : 'Out for Delivery'}
                  </span>
                </div>

                {/* Step 3: Completed / Picked Up / Delivered */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                    statusConfig.stepIndex >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <CheckCircle size={22} />
                  </div>
                  <span className={`text-[11px] mt-2 ${statusConfig.stepIndex >= 3 ? 'font-bold text-gray-900' : 'font-medium text-gray-400'}`}>
                    {isSelfPickup ? 'Picked Up' : 'Delivered'}
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Section 2: Items List & Subtotal */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-black text-gray-950">Item</h3>
              <p className="text-xs text-gray-400 font-medium">Review the products included in this order.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-extrabold">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* Item Rows */}
          <div className="space-y-4">
            {items.map((item) => {
              const foodItem = item.food_item;
              const mediaPath = foodItem?.image?.media_path 
                ? `${import.meta.env.VITE_API_BASE_URL}/storage/${foodItem.image.media_path}` 
                : null;
              const imageUrl = mediaPath || no_image;

              return (
               <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gray-50/60 border border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Product Image with Quantity Badge */}
                  <div className="relative w-16 h-16 rounded-2xl bg-white border border-gray-200 shrink-0 flex items-center justify-center p-2 shadow-2xs">
                    <img src={imageUrl} alt={item.food_item_name} className="w-full h-full object-cover rounded-xl" />
                    <span className="absolute -top-1.5 -right-1.5 bg-gray-950 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-950">{item.food_item_name}</h4>
                    {foodItem?.category?.title && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200/70 text-gray-700 text-[10px] font-bold rounded-md">
                        {foodItem.category.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-gray-950 block">Rs. {Number(item.item_total).toFixed(2)}</span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {item.quantity} × Rs. {Number(item.item_total / item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              );
            })}
          </div>

          {/* Calculations */}
          <div className="space-y-3 pt-2 text-sm text-gray-500 font-medium border-t border-gray-100">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span className="font-bold text-gray-950">Rs. {Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-gray-950">Rs. {Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-base">
              <span className="font-black text-gray-950">Total</span>
              <span className="font-black text-gray-950 text-lg">Rs. {Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Need Help With Your Order? */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-7 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-gray-950">Need help with your order?</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Message {restaurant?.name || 'Support'} directly about this order.</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer shrink-0">
            Contact Support
          </button>
        </div>

        {/* Section 4: Bottom 2-Column Grid (Fulfillment/Pickup Details & Total Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping / Pickup Details Card */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-5">
            <div>
              <h3 className="text-base font-black text-gray-950 flex items-center gap-2">
                {isSelfPickup ? (
                  <>
                    <Store size={18} className="text-orange-500" />
                    Pickup details
                  </>
                ) : (
                  <>
                    <MapPin size={18} className="text-orange-500" />
                    Shipping details
                  </>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {isSelfPickup ? 'Restaurant location for your pickup order.' : 'Your chosen delivery method and shipping information.'}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="pb-3 border-b border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Fulfillment Method</span>
                <span className="text-sm font-black text-gray-950 mt-0.5 block capitalize">
                  {order.delivery_method.replace('_', ' ')}
                </span>
              </div>

              {isSelfPickup ? (
                /* Conditional view for Self-Pickup showing Restaurant Info */
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Pickup From Restaurant</span>
                  <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
                    <p className="text-xs font-extrabold text-gray-950 flex items-center gap-1.5">
                      <Store size={14} className="text-orange-500" />
                      {restaurant?.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">{restaurant?.address}, {restaurant?.city}</p>
                    {restaurant?.phone && (
                      <p className="text-xs text-gray-500 font-medium">Phone: {restaurant.phone}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Standard Shipping Address view */
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Shipping Address</span>
                  <p className="text-xs font-bold text-gray-900 mt-1">{order.first_name} {order.last_name}</p>
                  <p className="text-xs text-gray-500 font-medium">{order.phone}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {order.address}{order.apartment ? `, ${order.apartment}` : ''}, {order.city}, {order.country}, {order.postcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total Summary Card */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-5">
            <div>
              <h3 className="text-base font-black text-gray-950 flex items-center gap-2">
                <Receipt size={18} className="text-orange-500" />
                Total Summary
              </h3>
              <p className="text-xs text-gray-400 font-medium">Your order total and payment method.</p>
            </div>

            <div className="space-y-3 pt-2 text-sm text-gray-500 font-medium">
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span>Sub Total</span>
                <span className="font-bold text-gray-950">Rs. {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span>{isSelfPickup ? 'Pickup Fee' : 'Shipping fee'}</span>
                <span className="font-bold text-gray-950">Rs. {Number(order.delivery_fee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100 text-base">
                <span className="font-black text-gray-950">Total</span>
                <span className="font-black text-gray-950 text-lg">Rs. {Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</span>
                <span className="text-xs font-extrabold text-gray-950 bg-gray-100 px-3 py-1.5 rounded-xl uppercase">
                  {order.payment_method}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;