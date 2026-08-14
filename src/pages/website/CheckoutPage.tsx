import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ChevronDown, Tag, ShieldCheck, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  // Dummy summary and items for layout matching reference design
  const cartItems = [
    { id: 1, name: "Max Pro 5 Earphone", price: 515.14, originalPrice: 599.00, quantity: 1, img: "/earphone.jpg" },
  ];
  const subtotal = 515.14;
  const shippingFee = 199.00;
  const total = subtotal + shippingFee;
  const totalSavings = 83.86;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/20 via-white to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Cart
          </button>
        </div>

        {/* Main 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            
            {/* Account / Email Section */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 font-black flex items-center justify-center text-base shadow-inner">
                  H
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Account</span>
                  <span className="text-sm font-extrabold text-gray-950">humairsarwar956@gmail.com</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Ship to Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-orange-600">Shipping Address</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/60 relative space-y-2 hover:border-orange-200 transition-all">
                <p className="text-sm font-semibold text-gray-900 leading-relaxed pr-8">
                  Humair Sarwar, Nai Abadi Chak jal din Girja road rawalpindi near allied bank<br />
                  Rawalpindi, PK, 03088340373
                </p>
                <div>
                  <span className="inline-block bg-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-orange-200/50">
                    Default
                  </span>
                </div>
              </div>

              <button className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 mt-2 transition-colors cursor-pointer">
                + Use a different address
              </button>
            </div>

            {/* Shipping Method Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-orange-600">Delivery Method</h3>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 flex items-center justify-between hover:border-orange-200 transition-all">
                <div>
                  <p className="text-sm font-bold text-gray-950">Cash on Delivery</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">(Note: Free Shipping Only Over Order Rs. 2000/-)</p>
                </div>
                <span className="text-sm font-black text-gray-950">Rs {shippingFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Newsletter checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="newsletter" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer" />
              <label htmlFor="newsletter" className="text-xs font-semibold text-gray-600 cursor-pointer">
                Email me with news and exclusive offers
              </label>
            </div>

            {/* Payment Section */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-950 tracking-tight">Payment Method</h2>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  All transactions are completely secure, encrypted, and safe.
                </p>
              </div>

              <div className="space-y-3">
                {/* COD Option */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50/30 shadow-xs' : 'border-gray-200/80 bg-gray-50/40 hover:bg-gray-50'}`}
                >
                  <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-orange-600 w-4 h-4 cursor-pointer" />
                  <span className="text-sm font-bold text-gray-950">Cash on Delivery (COD)</span>
                </div>

                {/* Online Payment Option */}
                <div 
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${paymentMethod === 'online' ? 'border-orange-600 bg-orange-50/30 shadow-xs' : 'border-gray-200/80 bg-gray-50/40 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3.5">
                    <input type="radio" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-orange-600 w-4 h-4 cursor-pointer" />
                    <span className="text-sm font-bold text-gray-950">Online Payment / Paypak / Debit & Credit Cards / EasyPaisa / JazzCash</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-2 pl-7 flex-wrap">
                    <span className="bg-blue-700 text-white font-black text-[10px] px-2.5 py-1 rounded-md tracking-wider shadow-2xs">VISA</span>
                    <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-md tracking-wider shadow-2xs">MASTERCARD</span>
                    <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md tracking-wider shadow-2xs">UnionPay</span>
                  </div>
                </div>
              </div>

              {/* Notice Box */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-xs text-orange-800 font-medium">
                You'll be seamlessly redirected to complete your online secure purchase.
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={() => navigate('/order-success')}
              className="w-full bg-gradient-to-r from-gray-950 to-gray-900 text-white py-4 rounded-2xl font-black hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-xl shadow-gray-950/20 active:scale-95 cursor-pointer text-sm tracking-wide"
            >
              Pay Now (Rs {total.toFixed(2)})
            </button>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] lg:sticky lg:top-8 space-y-6">
            <h3 className="text-lg font-black text-gray-950 tracking-tight">Order Summary</h3>
            
            {/* Item Row */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 shadow-2xs">
                  <img src="/earphone.jpg" alt="Max Pro 5 Earphone" className="w-full h-full object-cover" />
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    1
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Max Pro 5 Earphone</h4>
                  <p className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-0.5">
                    <Tag size={12} /> PAKISTAN (-Rs 83.86)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through block font-medium">Rs 599.00</span>
                <span className="font-black text-sm text-gray-950">Rs 515.14</span>
              </div>
            </div>

            {/* Discount Code Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-grow bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 font-medium"
              />
              <button className="bg-gray-950 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-sm">
                Apply
              </button>
            </div>

            {/* Applied Tag / Coupon */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-800 text-xs font-black px-3 py-1.5 rounded-xl border border-orange-200/60 shadow-2xs">
                <Tag size={12} className="text-orange-600" /> PAKISTAN 
                <button className="text-orange-400 hover:text-orange-700 ml-1 cursor-pointer">×</button>
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-2 text-sm text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-950">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">Shipping <span className="text-xs text-gray-400">ⓘ</span></span>
                <span className="font-bold text-gray-950">Rs {shippingFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
              <div>
                <span className="text-base font-black text-gray-950 block">Total Amount</span>
                <span className="text-xs font-bold text-gray-400">PKR</span>
              </div>
              <span className="text-2xl font-black text-orange-600">
                Rs {total.toFixed(2)}
              </span>
            </div>

            {/* Total Savings Note */}
            <div className="flex items-center gap-2 text-xs font-black text-emerald-700 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
              <Tag size={14} className="text-emerald-600" />
              <span>TOTAL SAVINGS Rs {totalSavings.toFixed(2)}</span>
            </div>

            {/* Security Badge */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold">
              <ShieldCheck size={16} className="text-orange-500" />
              <span>Safe & Secure Encrypted Checkout</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;