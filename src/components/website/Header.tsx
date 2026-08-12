import React, { useState, useRef, useEffect } from "react";
import { User, Search, MapPin, Phone, ShoppingBag, Utensils, Store, LayoutDashboard, FileText, Heart, UserCog, LogOut, ChevronDown } from "lucide-react";
import { CartModal } from "./CartModal";
import { SearchModal } from "./SearchModal";
import logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Retrieve token and role from Redux state
  const { token, role } = useAppSelector((state) => state.auth);

  // Close dropdown when clicking outside (primarily for mobile or outside clicks)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 150);
    }
  };

  // Toggle dropdown on click (works on mobile/tablet, or as a click toggle on desktop if preferred)
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle user logout action
  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="w-full">
        {/* 1. Mini Header */}
        <div className="bg-[#111318] text-gray-300 py-2.5 text-[10px] font-bold uppercase tracking-widest">
          <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
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
          <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
            {/* Logo */}
            <NavLink to='/' className="flex items-center gap-2 cursor-pointer">
              <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 overflow-hidden flex items-center justify-center">
                <img src={logo} alt="Foodie Logo" className="w-full h-full object-contain" />
              </div>
            </NavLink>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {["Home", "Browse Web", "About", "Contact"].map((item) => {
                let path = "";
                if (item === "Home") {
                  path = "/";
                } else if (item === "Browse Web") {
                  path = "/food-items/All";
                } else {
                  path = `/${item.toLowerCase().replace(" ", "-")}`;
                }

                return (
                  <NavLink
                    key={item}
                    to={path}
                    className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-all uppercase tracking-widest hover:-translate-y-0.5"
                  >
                    {item}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Side: Search, Cart & Authentication Section */}
            <div className="flex items-center gap-2 sm:gap-4">
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

              {/* Conditional Rendering based on Authentication Token and Role */}
              {!token ? (
                // Show Login Button if token does not exist
                <button 
                  onClick={() => navigate('/login')} 
                  className="flex items-center gap-2 px-3 sm:px-6 cursor-pointer py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <User size={14} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              ) : (
                // Show Dropdown Menu: Hover on Desktop, Click on Mobile/Tablet
                <div 
                  className="relative" 
                  ref={dropdownRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={handleDropdownToggle}
                    className="flex items-center gap-2 px-3 sm:px-4 cursor-pointer py-2 sm:py-2.5 bg-gray-950 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <User size={14} />
                    <span className="hidden sm:inline">
                      {role === "admin" ? "Admin" : "Account"}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Options List */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 pt-2 w-56 z-50">
                      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {role === "user" && (
                          <>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/user/dashboard"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <LayoutDashboard size={16} /> Dashboard
                            </button>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/user/orders"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <FileText size={16} /> Food Item Orders
                            </button>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/user/wishlist"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <Heart size={16} /> Wishlist
                            </button>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/user/profile-info"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <UserCog size={16} /> Profile Info
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                          </>
                        )}

                        {role === "admin" && (
                          <>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/admin/dashboard"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <LayoutDashboard size={16} /> Dashboard
                            </button>
                            <button
                              onClick={() => { setIsDropdownOpen(false); navigate("/admin/orders"); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <FileText size={16} /> Orders
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

export default Header;