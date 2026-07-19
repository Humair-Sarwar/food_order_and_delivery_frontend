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
    <section className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Our Advantages</h2>
        <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight">Stunning Features</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="group relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 text-left shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)",
              border: "1px solid #fed7aa"
            }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};