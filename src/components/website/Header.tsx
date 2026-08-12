import React, { useState } from "react";
import { User, Search, MapPin, Phone, ShoppingBag, Utensils, Store } from "lucide-react";
import { CartModal } from "./CartModal";
import { SearchModal } from "./SearchModal";
import logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="w-full">
        {/* 1. Mini Header */}
        <div className="bg-[#111318] text-gray-300 py-2.5 text-[10px] font-bold uppercase tracking-widest">
          <div className="mx-4 sm:mx-7 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            {/* Left Side Info */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-orange-500" /> Islamabad, Pakistan
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-orange-500" /> +92 300 0000000
              </span>
            </div>
            
            {/* Right Side Buttons: Food Items & Restaurants */}
            <div className="flex items-center gap-3 sm:gap-4">
              <NavLink
                to="/food-items/All"
                className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
              >
                <Utensils size={12} className="text-orange-500" /> Food Items
              </NavLink>
              <span className="text-gray-600">|</span>
              <NavLink
                to="/restaurants"
                className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
              >
                <Store size={12} className="text-orange-500" /> Restaurants
              </NavLink>
            </div>
          </div>
        </div>

        {/* 2. Main Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="mx-4 sm:mx-7 px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <NavLink to='/' className="flex items-center gap-2 cursor-pointer">
              <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden flex items-center justify-center">
                <img src={logo} alt="Foodie Logo" className="w-full h-full object-contain" />
              </div>
            </NavLink>

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
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors p-2"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Cart Icon with notification badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-400 cursor-pointer hover:text-gray-900 transition-colors p-2"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
              </button>

              <button 
                onClick={() => navigate('/login')} 
                className="flex items-center gap-2 px-4 sm:px-6 cursor-pointer py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
              >
                <User size={14} />
                <span>Login</span>
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