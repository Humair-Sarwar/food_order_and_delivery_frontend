import React, { useState } from "react";
import { User, Search, MapPin, Phone, ShoppingBag } from "lucide-react";
import { CartModal } from "./CartModal";
import { SearchModal } from "./SearchModal";

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <>
      <header className="w-full">
        {/* 1. Mini Header */}
        <div className="bg-[#111318] text-gray-300 py-2 text-[10px] font-bold uppercase tracking-widest">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Islamabad, Pakistan
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> +92 300 0000000
              </span>
            </div>
            <div className="hidden sm:block">
              <span>Free Delivery On Orders Over Rs. 2000</span>
            </div>
          </div>
        </div>

        {/* 2. Main Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-9 w-9 bg-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tighter">
                FOODIE
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-10">
              {["Home", "Browse Web", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-all uppercase tracking-widest hover:-translate-y-0.5"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right Side: Search, Cart & Login */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-2"
              >
                <Search size={18} />
              </button>

              {/* Cart Icon with notification badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-400 hover:text-gray-900 transition-colors p-2"
              >
                <ShoppingBag size={18} />
              </button>

              <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95">
                <User size={14} />
                Login
              </button>
            </div>
          </div>
        </div>
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
