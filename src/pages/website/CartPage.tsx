import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const cartItems = [
  { id: 1, name: "Delicious Burger", price: 650, quantity: 2, img: "/burger.jpg" },
  { id: 2, name: "Cheesy Fries", price: 350, quantity: 1, img: "/fries.jpg" },
];

export const CartPage: React.FC = () => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
          <ShoppingBag size={24} />
        </div>
        <h1 className="text-4xl font-black text-gray-950">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="group flex items-center gap-6 bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <img src={item.img} alt={item.name} className="w-28 h-28 rounded-[1.5rem] object-cover bg-gray-100" />
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-950">{item.name}</h3>
                <p className="text-orange-600 font-black text-lg">Rs. {item.price}</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-orange-600 transition-colors"><Minus size={14} /></button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-orange-600 transition-colors"><Plus size={14} /></button>
                </div>
                <button className="text-gray-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white p-8 rounded-[2rem] h-fit border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-8">
          <h2 className="text-xl font-black mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-bold text-gray-950">Rs. {subtotal}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery</span><span className="font-bold text-green-600">Free</span></div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-black text-orange-600">Rs. {subtotal}</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-gray-950 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-gray-950/20">
            Proceed to Checkout <ArrowRight size={20} />
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">Secure checkout powered by Square</p>
        </div>
      </div>
    </div>
  );
};