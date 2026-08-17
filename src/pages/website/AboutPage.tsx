import React from 'react';
import { Utensils, ShieldCheck, Clock, Award, Users, Smile } from 'lucide-react';
import aboutImg from "../../assets/images/wide-delivery.jpg"; // Aap yahan apni pasand ki koi bhi hero/about image import kar sakte hain

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* 1. Hero / Header Banner */}
      <section className="bg-gray-950 text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        <div className="max-w-[96rem] mx-auto text-center space-y-4 relative z-10">
          <h2 className="text-xs sm:text-sm font-bold text-orange-500 uppercase tracking-[0.3em]">Our Story</h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Redefining Food Delivery <br className="hidden sm:inline" />
            <span className="text-orange-500">With Passion & Speed</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We bridge the gap between your favorite local kitchens and your dining table, bringing you hot, fresh meals right when you crave them.
          </p>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[96rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image / Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative bg-orange-50 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12">
              <div className="aspect-[4/3] bg-white rounded-[2rem] shadow-xl shadow-orange-500/10 overflow-hidden flex items-center justify-center">
                <img 
                  src={aboutImg} 
                  alt="About Foodie" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 right-6 sm:right-12 bg-gray-950 text-white p-6 rounded-2xl shadow-2xl">
                <p className="text-2xl sm:text-3xl font-black text-orange-500">5+ Years</p>
                <p className="text-xs sm:text-sm text-gray-300">Serving Happiness Daily</p>
              </div>
            </div>
          </div>

          {/* Right: Content Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h2 className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Who We Are</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-[1.1]">
                Delivering More Than Just Meals, We Deliver Experiences.
              </h3>
            </div>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Founded with a simple mission to make quality food accessible without delays, Foodie has grown into a trusted community platform. We partner with top-rated local restaurants to maintain strict standards of taste, hygiene, and timely delivery.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1 border-l-2 border-orange-500 pl-4">
                <p className="text-2xl sm:text-3xl font-black text-gray-950">150+</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Partner Restaurants</p>
              </div>
              <div className="space-y-1 border-l-2 border-orange-500 pl-4">
                <p className="text-2xl sm:text-3xl font-black text-gray-950">50K+</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Happy Customers</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values / Why Choose Us */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 bg-gray-50">
        <div className="max-w-[96rem] mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Our Core Values</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">Why People Trust Us</h3>
            <p className="text-gray-500 text-sm sm:text-base">We prioritize your convenience, safety, and culinary satisfaction above everything else.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock size={28} />, title: "Lightning Fast", desc: "Optimized dispatch routes ensure your food arrives piping hot under 30 minutes." },
              { icon: <ShieldCheck size={28} />, title: "100% Secure", desc: "Safe transactions processed instantly via trusted gateways like Square." },
              { icon: <Utensils size={28} />, title: "Fresh Quality", desc: "Rigorous quality checks directly partnered with top-tier chefs and kitchens." },
              { icon: <Smile size={28} />, title: "24/7 Support", desc: "Friendly customer service crew always active to help you resolve any inquiry." },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-950">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};