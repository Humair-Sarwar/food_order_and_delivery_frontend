import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-7 h-[600px] overflow-hidden rounded-[3rem] bg-gray-900 shadow-2xl">
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
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-12 flex items-center h-full">
            <div className="max-w-xl space-y-6">
              <h1 className="text-7xl md:text-8xl font-extrabold text-white leading-[0.9]">
                {slides[index].title}
              </h1>
              <p className="text-lg text-gray-200 font-light">{slides[index].subtitle}</p>
              
              {/* Orange Button */}
              <button className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/30">
                ORDER NOW
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Clickable Progress Indicators */}
<div className="absolute bottom-10 left-12 flex gap-3 z-20">
  {slides.map((_, i) => (
    <button
      key={i}
      onClick={() => setIndex(i)}
      className="h-1 w-12 bg-white/20 rounded-full overflow-hidden"
    >
      <motion.div 
        // KEY add karne se animation har slide par reset hogi
        key={index === i ? "active" : "inactive"}
        className="h-full bg-orange-500"
        initial={{ width: i === index ? "0%" : "0%" }}
        animate={{ width: i === index ? "100%" : "0%" }}
        // Duration 7s rakha hai kyunki auto-slide timer bhi 7s hai
        transition={{ duration: i === index ? 7 : 0, ease: "linear" }}
      />
    </button>
  ))}
</div>
    </div>
  );
};