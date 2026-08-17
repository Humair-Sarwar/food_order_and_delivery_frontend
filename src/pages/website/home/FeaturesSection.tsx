import React from 'react';
import { Headphones, CreditCard, Rocket, Tag } from 'lucide-react';

const features = [
  { title: "24h Support", desc: "Always here to help you around the clock.", icon: <Headphones size={28} /> },
  { title: "Easy Payment", desc: "Secure and seamless transactions daily.", icon: <CreditCard size={28} /> },
  { title: "Fast Delivery", desc: "Speedy delivery at your doorstep.", icon: <Rocket size={28} /> },
  { title: "Best Prices", desc: "Quality services at budget-friendly rates.", icon: <Tag size={28} /> }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-10 bg-gray-100">
      <div className="max-w-[96rem] mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <h2 className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Our Advantages</h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight">Stunning Features</h1>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 text-left shadow-lg"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
                border: "1px solid #fed7aa"
              }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};