import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  ExternalLink,
  CheckCircle2,
  Utensils,
  Clock,
  Globe
} from 'lucide-react';
import { useAppDispatch } from "../../hooks/redux"; 
import { logout as logoutAction } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { useLogout } from '../../hooks/auth/useLogin';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed, setIsCollapsed, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: mutateLogout, isPending: isLoggingOut } = useLogout();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Logout Handler Function
  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setShowProfileMenu(false);
        toast.success("Admin session terminated successfully");
        navigate("/login", { replace: true });
      },
      onError: () => {
        // Fallback even if API throws an error
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setShowProfileMenu(false);
        navigate("/login", { replace: true });
      },
    });
  };

  const dummyNotifications = [
    {
      id: 1,
      title: "New Order Received",
      desc: "Order #10294 placed by Bilal Khan",
      time: "2 mins ago",
      icon: Clock,
      iconColor: "text-orange-500 bg-orange-500/10"
    },
    {
      id: 2,
      title: "Restaurant Onboarding",
      desc: "'Spicy Bytes' submitted verification docs",
      time: "15 mins ago",
      icon: Utensils,
      iconColor: "text-emerald-500 bg-emerald-500/10"
    },
    {
      id: 3,
      title: "System Update",
      desc: "Payout settlement batch completed successfully",
      time: "1 hour ago",
      icon: CheckCircle2,
      iconColor: "text-blue-500 bg-blue-500/10"
    }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close notification dropdown if clicked outside
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
      // Close profile dropdown if clicked outside
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-gray-200/80 bg-white px-6 shadow-sm backdrop-blur-md bg-white/95">
      
      {/* LEFT SECTION: Hamburger Trigger & Browse Web Button */}
      <div className="flex items-center gap-4">
        {/* Mobile Burger Menu Trigger */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 bg-gray-50 active:scale-95 transition-transform cursor-pointer lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Browse Customer Web Core Action */}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 h-10 text-xs font-bold bg-gray-900 text-white hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-gray-900/10 active:scale-98 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 opacity-80" />
          <span>Browse Web</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* RIGHT SECTION: Notification Dropdown & Profile Dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Dynamic Alerts Notification Hub System */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowProfileMenu(false); 
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer ${
              showNotificationMenu 
                ? 'border-orange-500/30 bg-orange-500/5 text-orange-500' 
                : 'border-gray-100 hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
            </span>
          </button>

          {/* Notification Dropdown Panel */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 mb-1">
                <span className="text-xs font-black text-gray-800">Recent Notifications</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-500/10 text-orange-600 rounded-md">
                  3 New
                </span>
              </div>

              <div className="space-y-0.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                {dummyNotifications.map((notif) => {
                  const NotifIcon = notif.icon;
                  return (
                    <div 
                      key={notif.id}
                      className="flex items-start gap-3 p-2.5 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${notif.iconColor}`}>
                        <NotifIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-800 group-hover:text-orange-500 transition-colors truncate">
                          {notif.title}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500 leading-tight mt-0.5 line-clamp-2">
                          {notif.desc}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400 mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-1.5 border-t border-gray-50 mt-1">
                <button className="w-full py-2 text-center text-[11px] font-bold text-gray-500 hover:text-orange-500 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider Visual Line Accent */}
        <span className="h-6 w-px bg-gray-200" />

        {/* Executive Admin Profile Matrix Section */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationMenu(false); // Mutually exclusive close logic
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Profile Avatar Frame"
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-orange-500/20 transition-all"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-extrabold text-gray-800 leading-none mb-0.5">System Admin</span>
              <span className="text-[10px] font-bold text-orange-500">Super User</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Floating Dropdown Canvas Panel Box Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Identity</p>
                <p className="text-xs font-bold text-gray-700 truncate">admin@stackfood.com</p>
              </div>

              <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <User className="w-4 h-4 text-gray-400" />
                My Profile
              </button>
              <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <Settings className="w-4 h-4 text-gray-400" />
                Account Settings
              </button>
              
              <div className="h-px bg-gray-50 my-1" />
              
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                {isLoggingOut ? "Terminating..." : "Logout Session"}
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;