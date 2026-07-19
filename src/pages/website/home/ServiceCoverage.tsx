import React from 'react';
import { MapPin, Truck, Clock } from 'lucide-react';

export const ServiceCoverage: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Illustration / Visual */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-orange-50 rounded-[3rem] p-8 md:p-12">
            {/* Replace this div with your actual illustration or Image */}
            <div className="aspect-square bg-white rounded-[2rem] shadow-xl shadow-orange-500/10 flex items-center justify-center">
              <MapPin size={120} className="text-orange-500 animate-pulse" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 bg-gray-900 text-white p-6 rounded-2xl shadow-2xl">
              <p className="text-sm font-bold">150+ Cities</p>
              <p className="text-xs text-gray-400">Expanding daily</p>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Service Areas</h2>
            <h1 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tight leading-tight">
              Wide Delivery <br/><span className="text-orange-600">Coverage Zones</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              We ensure your favorite meals reach you fast, no matter where you are. Check our active delivery zones and track your order in real-time.
            </p>
          </div>

          {/* Key Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Truck size={20} />, text: "Real-time Tracking" },
              { icon: <Clock size={20} />, text: "Under 30 Min Delivery" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 px-5 py-4 rounded-2xl font-semibold text-gray-800">
                <div className="text-orange-600">{item.icon}</div>
                {item.text}
              </div>
            ))}
          </div>

          <button className="bg-gray-950 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gray-950/10">
            Check Delivery Status
          </button>
        </div>
      </div>
    </section>
  );
};