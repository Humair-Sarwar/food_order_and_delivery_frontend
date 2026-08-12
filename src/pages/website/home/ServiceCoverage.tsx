import React from 'react';
import { Truck, Clock } from 'lucide-react';
import wide_range from "../../../assets/images/wide-delivery.jpg";

export const ServiceCoverage: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-10 bg-white">
      <div className="max-w-[96rem] mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
        
        {/* Left Side: Illustration / Visual */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-orange-50 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12">
            {/* Image Container */}
            <div className="aspect-square bg-white rounded-[2rem] shadow-xl shadow-orange-500/10 flex items-center justify-center overflow-hidden">
              <img 
                src={wide_range} 
                alt="Wide Delivery Coverage" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-gray-900 text-white p-4 sm:p-6 rounded-2xl shadow-2xl">
              <p className="text-xs sm:text-sm font-bold">150+ Cities</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Expanding daily</p>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Service Areas</h2>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.1]">
              Wide Delivery <br/><span className="text-orange-600">Coverage Zones</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-lg">
              We ensure your favorite meals reach you fast, no matter where you are. Check our active delivery zones and track your order in real-time.
            </p>
          </div>

          {/* Key Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { icon: <Truck size={20} />, text: "Real-time Tracking" },
              { icon: <Clock size={20} />, text: "Under 30 Min Delivery" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 px-5 py-4 rounded-2xl font-semibold text-gray-800 border border-gray-100">
                <div className="text-orange-600">{item.icon}</div>
                <span className="text-sm sm:text-base">{item.text}</span>
              </div>
            ))}
          </div>

          <button className="bg-gray-950 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gray-950/10 cursor-pointer text-sm sm:text-base">
            Check Delivery Status
          </button>
        </div>
      </div>
    </section>
  );
};