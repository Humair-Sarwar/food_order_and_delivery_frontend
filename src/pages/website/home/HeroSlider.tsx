import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const slides = [
  { 
    title: "Gourmet Burger", 
    subtitle: "Juicy, flame-grilled perfection.", 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000"
  },
  { 
    title: "Fresh Sushi", 
    subtitle: "Artfully crafted seafood delights.", 
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000"
  },
  { 
    title: "Italian Pasta", 
    subtitle: "Authentic flavors of Rome.", 
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=2000"
  }
];

export const HeroSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigate();
  // Auto-slide logic triggered every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
      {/* Expanded container wrapper matching website layout */}
      <div className="relative max-w-[96rem] mx-auto h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-gray-900 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image Container */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[index].image})` }}
            />
            
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content Wrapper */}
            <div className="relative z-10 w-full h-full max-w-[96rem] mx-auto px-6 sm:px-12 md:px-16 flex items-center">
              <div className="max-w-xl space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] sm:leading-[0.9] tracking-tight">
                  {slides[index].title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light max-w-md">
                  {slides[index].subtitle}
                </p>
                
                {/* Action Button */}
                <button onClick={()=> navigation('/food-items/All')} className="px-8 sm:px-10 py-3.5 sm:py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/30 cursor-pointer text-sm sm:text-base">
                  ORDER NOW
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Clickable Progress Indicators / Navigation Pills */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-6 sm:left-12 md:left-16 flex gap-2 sm:gap-3 z-25">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-1.5 sm:h-1 w-8 sm:w-12 bg-white/20 rounded-full overflow-hidden cursor-pointer"
              aria-label={`Go to slide ${i + 1}`}
            >
              <motion.div 
                // Key ensures animation resets on active state switch
                key={index === i ? "active" : "inactive"}
                className="h-full bg-orange-500"
                initial={{ width: i === index ? "0%" : "0%" }}
                animate={{ width: i === index ? "100%" : "0%" }}
                // Duration set to 7s matching the auto-slide timer
                transition={{ duration: i === index ? 7 : 0, ease: "linear" }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};