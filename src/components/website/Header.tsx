import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Search,
  MapPin,
  Phone,
  ShoppingBag,
  Utensils,
  Store,
  LayoutDashboard,
  FileText,
  Heart,
  UserCog,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import { CartModal } from "./CartModal";
import { SearchModal } from "./SearchModal";
import logo from "../../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { useCart } from "../../hooks/website/useCart";
import { useLogout } from "../../hooks/auth/useLogin";
import { useCustomerNotifications } from "../../hooks/website/useCustomerNotifications";

interface HeaderProps {
  settings?: {
    id?: number;
    site_name?: string;
    email?: string | null;
    phone?: string | null;
    whatsapp_number?: string | null;
    whatsapp_enabled?: boolean;
    footer_description?: string | null;
    logo_id?: string | null;
    cod_enabled?: boolean;
    digital_payment_enabled?: boolean;
    logo?: {
      id: string;
      media_path: string;
    } | null;
  };
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  // ============================================================
  // CUSTOMER NOTIFICATIONS
  // ============================================================

  const {
    data: notificationResponse,
    isPending: isNotificationsLoading,
    isError: isNotificationsError,
  } = useCustomerNotifications();

  const notifications = notificationResponse?.data ?? [];

  const unreadCount = notificationResponse?.unread_count ?? 0;

  // ============================================================
  // STATES
  // ============================================================

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ============================================================
  // REFS
  // ============================================================

  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificationRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================
  // NAVIGATION / REDUX
  // ============================================================

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  // ============================================================
  // AUTH
  // ============================================================

  const { token, role } = useAppSelector(
    (state) => state.auth
  );

  // ============================================================
  // CART
  // ============================================================

  const [cartId, setCartId] = useState<string | null>(
    localStorage.getItem("cart_id")
  );

  const { data: cartData } = useCart(cartId);

  const cartItemsCount =
    cartData?.data?.items?.length ?? 0;

  // ============================================================
  // LOGOUT
  // ============================================================

  const {
    mutate: mutateLogout,
    isPending,
  } = useLogout();

  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        setIsDropdownOpen(false);

        setIsNotificationOpen(false);

        navigate("/login", {
          replace: true,
        });
      },

      onError: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        setIsDropdownOpen(false);

        setIsNotificationOpen(false);

        navigate("/login", {
          replace: true,
        });
      },
    });
  };

  // ============================================================
  // OUTSIDE CLICK
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Account dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }

      // Notification dropdown
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // CART UPDATE LISTENER
  // ============================================================

  useEffect(() => {
    const handleCartUpdated = () => {
      setCartId(localStorage.getItem("cart_id"));
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );
    };
  }, []);

  // ============================================================
  // DESKTOP HOVER
  // ============================================================

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

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

  // ============================================================
  // ACCOUNT DROPDOWN TOGGLE
  // ============================================================

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);

    // Close notifications
    setIsNotificationOpen(false);
  };

  // ============================================================
  // NOTIFICATION TOGGLE
  // ============================================================

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => !prev);

    // Close account dropdown
    setIsDropdownOpen(false);
  };

  // ============================================================
  // OPEN ORDER FROM NOTIFICATION
  // ============================================================

  const handleNotificationClick = (
    orderId: string | number
  ) => {
    setIsNotificationOpen(false);

    navigate(`/user/order/${orderId}`);
  };

  // ============================================================
  // RENDER
  // ============================================================
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
    <>
      <header className="w-full">

        {/* ================================================== */}
        {/* MINI HEADER */}
        {/* ================================================== */}

        <div className="bg-[#111318] text-gray-300 py-2.5 text-[10px] font-bold uppercase tracking-widest">
          <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">

            {/* LEFT INFO */}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">

              <span className="flex items-center gap-1.5">
                <MapPin
                  size={12}
                  className="text-orange-500"
                />

                Islamabad, Pakistan
              </span>

              <a href={`tel:${settings?.phone || "+92 300 0000000"}`} className="flex items-center gap-1.5">
                <Phone
                  size={12}
                  className="text-orange-500"
                />

                {settings?.phone || "+92 300 0000000"}
              </a>

            </div>

            {/* RIGHT LINKS */}

            <div className="flex items-center gap-3 sm:gap-4">

              <NavLink
                to="/food-items/All"
                className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
              >
                <Utensils
                  size={12}
                  className="text-orange-500"
                />

                Food Items
              </NavLink>

              <span className="text-gray-600">
                |
              </span>

              <NavLink
                to="/restaurants"
                className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
              >
                <Store
                  size={12}
                  className="text-orange-500"
                />

                Restaurants
              </NavLink>

            </div>

          </div>
        </div>

        {/* ================================================== */}
        {/* MAIN HEADER */}
        {/* ================================================== */}

        <div className="bg-white border-b border-gray-100 sticky top-0 z-50">

          <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">

            {/* ================================================== */}
            {/* LOGO */}
            {/* ================================================== */}

            <NavLink
              to="/"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 overflow-hidden flex items-center justify-center">

                <img
                  src={
                    settings?.logo?.media_path
                      ? `${API_BASE_URL}/storage/${settings.logo.media_path}`
                      : logo
                  }
                  alt={settings?.site_name || "Online Food Ordering & Delivery System Logo"}
                  className="w-full h-full object-contain"
                />

              </div>
            </NavLink>

            {/* ================================================== */}
            {/* NAVIGATION */}
            {/* ================================================== */}

            <nav className="hidden md:flex items-center gap-8 lg:gap-10">

              {[
                "Home",
                "Browse Web",
                "About",
                "Contact",
              ].map((item) => {

                let path = "";

                if (item === "Home") {
                  path = "/";
                } else if (item === "Browse Web") {
                  path = "/food-items/All";
                } else {
                  path = `/${item
                    .toLowerCase()
                    .replace(" ", "-")}`;
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

            {/* ================================================== */}
            {/* RIGHT SIDE */}
            {/* ================================================== */}

            <div className="flex items-center gap-2 sm:gap-4">

              {/* ================================================== */}
              {/* SEARCH */}
              {/* ================================================== */}

              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors p-2"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* ================================================== */}
              {/* CART */}
              {/* ================================================== */}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-400 cursor-pointer hover:text-gray-900 transition-colors p-2"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />

                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemsCount}
                  </span>
                )}

              </button>

              {/* ================================================== */}
              {/* NOTIFICATIONS */}
              {/* ================================================== */}

              {token && role === "user" && (
                <div
                  className="relative"
                  ref={notificationRef}
                >

                  {/* BELL BUTTON */}

                  <button
                    onClick={
                      handleNotificationToggle
                    }
                    className={`relative text-gray-400 cursor-pointer hover:text-gray-900 transition-colors p-2 ${
                      isNotificationOpen
                        ? "text-orange-600"
                        : ""
                    }`}
                    aria-label="Notifications"
                  >

                    <Bell size={18} />

                    {/* UNREAD BADGE */}

                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-orange-600 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </span>
                    )}

                  </button>

                  {/* ================================================== */}
                  {/* NOTIFICATION DROPDOWN */}
                  {/* ================================================== */}

                  {isNotificationOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">

                      {/* HEADER */}

                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">

                        <div>
                          <h3 className="text-sm font-black text-gray-900">
                            Notifications
                          </h3>

                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                            Your latest order updates
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black">
                            {unreadCount} New
                          </span>
                        )}

                      </div>

                      {/* ================================================== */}
                      {/* NOTIFICATION LIST */}
                      {/* ================================================== */}

                      <div className="max-h-[360px] overflow-y-auto">

                        {/* LOADING */}

                        {isNotificationsLoading && (
                          <div className="p-5 space-y-4">

                            {[1, 2, 3].map(
                              (item) => (
                                <div
                                  key={item}
                                  className="flex gap-3 animate-pulse"
                                >

                                  <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />

                                  <div className="flex-1 space-y-2">

                                    <div className="h-3 bg-gray-100 rounded w-3/4" />

                                    <div className="h-2 bg-gray-100 rounded w-full" />

                                    <div className="h-2 bg-gray-100 rounded w-1/3" />

                                  </div>

                                </div>
                              )
                            )}

                          </div>
                        )}

                        {/* ERROR */}

                        {!isNotificationsLoading &&
                          isNotificationsError && (
                            <div className="py-10 px-5 text-center">

                              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
                                <Bell size={20} />
                              </div>

                              <p className="text-sm font-black text-gray-700">
                                Unable to load notifications
                              </p>

                              <p className="text-[11px] font-semibold text-gray-400 mt-1">
                                Please try again later.
                              </p>

                            </div>
                          )}

                        {/* EMPTY */}

                        {!isNotificationsLoading &&
                          !isNotificationsError &&
                          notifications.length === 0 && (
                            <div className="py-10 px-6 text-center">

                              <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                                <Bell
                                  size={20}
                                  className="text-gray-300"
                                />
                              </div>

                              <p className="text-sm font-black text-gray-700">
                                No notifications
                              </p>

                              <p className="text-[11px] font-semibold text-gray-400 mt-1">
                                You're all caught up!
                              </p>

                            </div>
                          )}

                        {/* NOTIFICATIONS */}

                        {!isNotificationsLoading &&
                          !isNotificationsError &&
                          notifications.length > 0 &&
                          notifications.map(
                            (notification) => (
                              <button
                                key={notification.id}
                                onClick={() =>
                                  handleNotificationClick(
                                    notification.id
                                  )
                                }
                                className="w-full flex items-start gap-3 p-4 text-left hover:bg-orange-50/40 border-b border-gray-50 transition-colors cursor-pointer"
                              >

                                {/* ICON */}

                                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                  <ShoppingBag size={17} />
                                </div>

                                {/* CONTENT */}

                                <div className="min-w-0 flex-1">

                                  <div className="flex items-start justify-between gap-2">

                                    <p className="text-xs font-black text-gray-900">
                                      {notification.title}
                                    </p>

                                    {notification.time && (
                                      <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">
                                        {notification.time}
                                      </span>
                                    )}

                                  </div>

                                  <p className="text-[11px] font-semibold text-gray-500 mt-1 line-clamp-2">
                                    {
                                      notification.description
                                    }
                                  </p>

                                  <div className="flex items-center gap-1 mt-2">

                                    <span className="text-[9px] font-black text-orange-600">
                                      Order #
                                      {
                                        notification.order_number
                                      }
                                    </span>

                                    {notification.status && (
                                      <>
                                        <span className="text-gray-300">
                                          •
                                        </span>

                                        <span className="text-[9px] font-bold text-gray-400 capitalize">
                                          {notification.status.replaceAll(
                                            "_",
                                            " "
                                          )}
                                        </span>
                                      </>
                                    )}

                                  </div>

                                  {notification.restaurant && (
                                    <p className="text-[9px] font-semibold text-gray-400 mt-1 truncate">
                                      {notification.restaurant}
                                    </p>
                                  )}

                                </div>

                              </button>
                            )
                          )}

                      </div>

                      {/* ================================================== */}
                      {/* FOOTER */}
                      {/* ================================================== */}

                      {notifications.length > 0 && (
                        <div className="p-2 border-t border-gray-100">

                          <button
                            onClick={() => {
                              setIsNotificationOpen(
                                false
                              );

                              navigate(
                                "/user/orders"
                              );
                            }}
                            className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-600 text-gray-600 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View All Orders
                          </button>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ================================================== */}
              {/* LOGIN / ACCOUNT */}
              {/* ================================================== */}

              {!token ? (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-3 sm:px-6 cursor-pointer py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <User size={14} />

                  <span className="hidden sm:inline">
                    Login
                  </span>
                </button>
              ) : (
                <div
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >

                  {/* ACCOUNT BUTTON */}

                  <button
                    onClick={
                      handleDropdownToggle
                    }
                    className="flex items-center gap-2 px-3 sm:px-4 cursor-pointer py-2 sm:py-2.5 bg-gray-950 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                  >

                    <User size={14} />

                    <span className="hidden sm:inline">
                      {role === "admin"
                        ? "Admin"
                        : "Account"}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {/* ACCOUNT DROPDOWN */}

                  {isDropdownOpen && (
                    <div className="absolute right-0 pt-2 w-56 z-50">

                      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">

                        {/* USER OPTIONS */}

                        {role === "user" && (
                          <>
                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/user/dashboard"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <LayoutDashboard
                                size={16}
                              />

                              Dashboard
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/user/orders"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <FileText size={16} />

                              Food Item Orders
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/user/wishlist"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <Heart size={16} />

                              Wishlist
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/user/profile-info"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <UserCog size={16} />

                              Profile Info
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/user/address"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <MapPin size={16} />

                              Address
                            </button>

                            <div className="my-1 border-t border-gray-100" />
                          </>
                        )}

                        {/* ADMIN OPTIONS */}

                        {role === "admin" && (
                          <>
                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/admin/dashboard"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <LayoutDashboard
                                size={16}
                              />

                              Dashboard
                            </button>

                            <button
                              onClick={() => {
                                setIsDropdownOpen(
                                  false
                                );

                                navigate(
                                  "/admin/orders"
                                );
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left cursor-pointer"
                            >
                              <FileText size={16} />

                              Orders
                            </button>

                            <div className="my-1 border-t border-gray-100" />
                          </>
                        )}

                        {/* LOGOUT */}

                        <button
                          onClick={handleLogout}
                          disabled={isPending}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer disabled:opacity-50"
                        >
                          <LogOut size={16} />

                          {isPending
                            ? "Logging out..."
                            : "Logout"}
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

      {/* ================================================== */}
      {/* SEARCH MODAL */}
      {/* ================================================== */}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() =>
          setIsSearchOpen(false)
        }
      />

      {/* ================================================== */}
      {/* CART MODAL */}
      {/* ================================================== */}

      <CartModal
        isOpen={isCartOpen}
        onClose={() =>
          setIsCartOpen(false)
        }
      />
    </>
  );
};

export default Header;