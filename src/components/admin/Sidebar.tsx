import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  // Truck, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  ChevronLeft,
  Image,
  Layers,
  Utensils,
  Receipt
} from 'lucide-react';
import logo from "../../assets/images/logo.png";
import { useAppDispatch } from "../../hooks/redux"; 
import { logout as logoutAction } from "../../store/slices/authSlice";
import { toast } from "react-toastify"; 
import { useLogout } from '../../hooks/auth/useLogin';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: mutateLogout, isPending: isLoggingOut } = useLogout();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number } | null>(null);

  // Logout Handler Function
  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setIsMobileOpen(false);
        toast.success("Admin session terminated successfully");
        navigate("/login", { replace: true });
      },
      onError: () => {
        // Fallback even if API throws an error
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setIsMobileOpen(false);
        navigate("/login", { replace: true });
      },
    });
  };

  const menuSections = [
    {
      title: "Overview",
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/admin/reports', label: 'Reports', icon: Receipt },
      ]
    },
    {
      title: "Management",
      items: [
        { path: '/admin/restaurants', label: 'Restaurants', icon: UtensilsCrossed, badge: 'New' },
        { path: '/admin/categories', label: 'Categories', icon: Layers, badge: null },
        { path: '/admin/food-items', label: 'Food Items', icon: Utensils, badge: null },
        { path: '/admin/customers', label: 'Customers', icon: Users, badge: null },
        // { path: '/admin/delivery-men', label: 'Delivery Men', icon: Truck, badge: null },
      ]
    },
    {
      title: "System",
      items: [
        { path: '/admin/media', label: 'Media', icon: Image, badge: null },
        { path: '/admin/settings', label: 'Settings', icon: Settings, badge: null },
      ]
    }
  ];

  const sidebarContent = (
    <>
      {/* Brand Identity Branding Logo Section */}
      <div className={`flex h-20 items-center border-b border-gray-900/60 bg-[#0d0e12] px-6 relative transition-all duration-300 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 group">
            <img 
              src={logo} 
              alt="StackFood Branding Logo" 
              className="w-40 h-auto object-contain transition-transform duration-300" 
            />
          </div>
        )}

        {/* Desktop Collapse Trigger Action Button Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-gray-800 bg-[#14171f] text-gray-500 hover:text-orange-400 hover:border-orange-500/30 cursor-pointer transition-all duration-200 shadow-md"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Primary Navigation Categorized Links Scroll Container */}
      <nav className={`flex-1 px-3 py-6 overflow-y-auto transition-all duration-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-700 ${
        isCollapsed ? 'space-y-2' : 'space-y-6'
      }`}>
        {menuSections.map((section, idx) => (
          <div key={idx} className={`transition-all duration-300 ${isCollapsed ? 'space-y-1' : 'space-y-1'}`}>
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold tracking-widest text-gray-600 uppercase select-none mb-2">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    onMouseEnter={(e) => {
                      if (isCollapsed) {
                        setHoveredItem(item.path);
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        if (rect) {
                          setTooltipPosition({ top: rect.top + rect.height / 2 });
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredItem(null);
                      setTooltipPosition(null);
                    }}
                    className={`flex items-center justify-between px-3.5 text-xs font-bold rounded-xl relative transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-600/30 font-extrabold translate-x-0.5'
                        : 'hover:bg-gray-800/40 hover:text-gray-100'
                    } ${isCollapsed ? 'justify-center py-3' : 'py-2.5'}`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-orange-500/10 blur-[2px] -z-10" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon 
                        className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105 shrink-0 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-400'
                        }`} 
                      />
                      {!isCollapsed && <span className="tracking-wide">{item.label}</span>}
                    </div>

                    {item.badge && !isCollapsed && (
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md capitalize tracking-wider transition-colors duration-300 border ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/10' 
                          : item.badge === 'New' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  
                  {/* Custom Tooltip for collapsed mode */}
                  {isCollapsed && hoveredItem === item.path && tooltipPosition && (
                    <div className="fixed px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap z-[100] pointer-events-none border border-gray-700" style={{ left: '80px', top: `${tooltipPosition.top}px`, transform: 'translateY(-50%)' }}>
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 border-l border-b border-gray-700 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin Quick Identity & Global Session Terminate Panel */}
      <div className="p-3 border-t border-gray-900/60 bg-[#0d0e12]">
        <div className={`flex items-center p-2 rounded-xl bg-[#14171f] border border-gray-800/40 shadow-xl mb-3 group/profile transition-all duration-300 ${
          isCollapsed ? 'justify-center border-transparent bg-transparent shadow-none mb-1' : 'justify-between hover:border-orange-500/20'
        }`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 text-xs font-black text-orange-500 shadow-inner">
                AD
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 border-2 border-[#14171f]" />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-gray-200 truncate">System Admin</span>
                  <ShieldCheck className="w-3 h-3 text-orange-400 shrink-0" />
                </div>
                <span className="text-[10px] font-medium text-gray-500 truncate">admin@ofods.com</span>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronRight className="w-4 h-4 text-gray-600 group-hover/profile:text-orange-400 group-hover/profile:translate-x-0.5 transition-all duration-300 shrink-0" />}
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isCollapsed ? "Logout Session" : ""}
          className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200 cursor-pointer group w-full disabled:opacity-50 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4.5 h-4.5 text-gray-600 group-hover:text-red-400 group-hover:-translate-x-0.5 transition-transform duration-200 shrink-0" />
          {!isCollapsed && <span className="tracking-wide">{isLoggingOut ? "Terminating..." : "Logout Session"}</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. DESKTOP PERMANENT STRUCTURE CONTAINER VIEWPORT */}
      <aside className={`fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col bg-[#111318] border-r border-gray-800/30 text-gray-400 shadow-[8px_0_32px_rgba(0,0,0,0.35)] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-66'
      }`}>
        {sidebarContent}
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY WRAPPER SHIELD COMPONENT PORTAL */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-66 flex-col bg-[#111318] text-gray-400 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;