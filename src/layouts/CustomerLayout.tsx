import React, { useState } from "react";
import { Header } from "../components/website/Header";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import WhatsAppButton from "../components/website/WhatsAppChat";
import { ChatWidget } from "../components/website/ChatWidget";
import { Footer } from "../components/website/Footer";
import { ShoppingBag, Heart, User, LayoutDashboard, ChevronRight, LogOut, Menu, X, MapPin } from "lucide-react";
import { useProfileInfo } from "../hooks/website/useProfile";
import { useAppDispatch } from "../hooks/redux";
import { logout as logoutAction } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useLogout } from "../hooks/auth/useLogin";

const CustomerLayout = () => {
  const { data, isLoading } = useProfileInfo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: mutateLogout, isPending: isLoggingOut } = useLogout();

  const profile = data?.data;
  const customerNavItems = [
    {
      title: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: "Food Item Orders",
      path: "/user/orders",
      icon: <ShoppingBag size={18} />,
      badge: "3",
    },
    {
      title: "Wishlist",
      path: "/user/wishlist",
      icon: <Heart size={18} />,
    },
    {
      title: "Addresses",
      path: "/user/address",
      icon: <MapPin size={18} />,
    },
    {
      title: "Profile Info",
      path: "/user/profile-info",
      icon: <User size={18} />,
    },
  ];

  // Logout Handler Function
  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setIsMobileMenuOpen(false);
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
      },
      onError: () => {
        // Fallback even if API fails
        dispatch(logoutAction());
        localStorage.removeItem("cart_id");
        setIsMobileMenuOpen(false);
        navigate("/login", { replace: true });
      },
    });
  };

  // Menu content ko reusable banane ke liye ek variable ya component
  const renderSidebarContent = () => (
    <div className="bg-white p-6 rounded-[2.5rem] md:border md:border-gray-100 md:shadow-[0_10px_40px_rgba(0,0,0,0.04)] md:sticky md:top-6 w-full">
      
      {/* User Profile Card Header */}
      <div className="flex items-center gap-3.5 px-3 mb-6 pb-6 border-b border-gray-100">
        {/* Profile Image */}
        <div className="w-13 h-13 rounded-2xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20 flex-shrink-0">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : profile?.image ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/storage/${profile.image}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            profile?.first_name?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        {/* User Info */}
        <div className="overflow-hidden">
          {isLoading ? (
            <>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h3 className="font-black text-gray-950 truncate text-base">
                {`${profile?.first_name || ""} ${
                  profile?.last_name || ""
                }`.trim() || "User"}
              </h3>
              <p className="text-xs font-semibold text-gray-400 truncate">
                {profile?.email || ""}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {customerNavItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)} // Mobile pe click krne pe modal close ho jaye
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all group ${
                isActive
                  ? "bg-gray-950 text-white shadow-xl shadow-gray-950/10 scale-[1.02]"
                  : "text-gray-600 hover:bg-orange-50/60 hover:text-orange-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span className={`transition-transform group-hover:scale-110 ${isActive ? "text-orange-500" : "text-gray-400 group-hover:text-orange-600"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={14} className={`opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? "opacity-100 translate-x-0 text-orange-500" : ""}`} />
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer group disabled:opacity-50"
        >
          <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-sm">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/70 relative">
      <Header />
      
      <main className="flex-grow max-w-[96rem] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Menu (Desktop View - Hidden on Mobile) */}
          <aside className="hidden md:block w-80 min-w-[20rem] flex-shrink-0">
            {renderSidebarContent()}
          </aside>

          {/* Right Content Area */}
          <section className="flex-grow w-full bg-white p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] min-h-[600px]">
            <Outlet />
          </section>

        </div>
      </main>

      {/* Mobile Floating Bottom Center Button */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 bg-gray-950 text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:bg-orange-600 transition-all active:scale-95 cursor-pointer border border-white/10"
        >
          <Menu size={18} />
          <span>Menu Options</span>
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
            {/* Close Button */}
            <div className="flex justify-end px-2 pt-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {renderSidebarContent()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerLayout;