import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Globe,
  XCircle,
} from "lucide-react";

import { useAppDispatch } from "../../hooks/redux";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { useLogout } from "../../hooks/auth/useLogin";
import { useAdminNotifications } from "../../hooks/admin/useNotifications";

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  isCollapsed,
  setIsCollapsed,
  setIsMobileOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const {
    data: notificationResponse,
    isPending: isNotificationsLoading,
    isError: isNotificationsError,
  } = useAdminNotifications();

  const notifications = notificationResponse?.data ?? [];

  const unreadCount = notificationResponse?.unread_count ?? 0;

  // =====================================================
  // LOGOUT
  // =====================================================

  const {
    mutate: mutateLogout,
    isPending: isLoggingOut,
  } = useLogout();

  // =====================================================
  // DROPDOWNS
  // =====================================================

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showNotificationMenu, setShowNotificationMenu] =
    useState(false);

  const notificationRef =
    useRef<HTMLDivElement | null>(null);

  const profileRef =
    useRef<HTMLDivElement | null>(null);

  // =====================================================
  // LOGOUT HANDLER
  // =====================================================

  const handleLogout = () => {
    mutateLogout(undefined, {
      onSuccess: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        setShowProfileMenu(false);

        toast.success(
          "Admin session terminated successfully"
        );

        navigate("/login", {
          replace: true,
        });
      },

      onError: () => {
        dispatch(logoutAction());

        localStorage.removeItem("cart_id");

        setShowProfileMenu(false);

        navigate("/login", {
          replace: true,
        });
      },
    });
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (
    status: string
  ) => {
    switch (status) {
      case "cancelled":
        return XCircle;

      case "completed":
        return CheckCircle2;

      case "pending":
        return Clock;

      case "confirmed":
      case "preparing":
      case "ready_for_pickup":
      case "out_for_delivery":
        return Utensils;

      default:
        return Bell;
    }
  };

  // =====================================================
  // NOTIFICATION ICON COLOR
  // =====================================================

  const getNotificationColor = (
    status: string
  ) => {
    switch (status) {
      case "cancelled":
        return "text-red-500 bg-red-500/10";

      case "completed":
        return "text-emerald-500 bg-emerald-500/10";

      case "pending":
        return "text-orange-500 bg-orange-500/10";

      case "confirmed":
        return "text-blue-500 bg-blue-500/10";

      case "preparing":
        return "text-purple-500 bg-purple-500/10";

      case "ready_for_pickup":
        return "text-indigo-500 bg-indigo-500/10";

      case "out_for_delivery":
        return "text-cyan-500 bg-cyan-500/10";

      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  // =====================================================
  // OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotificationMenu(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setShowProfileMenu(false);
      }
    }

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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-gray-200/80 bg-white px-6 shadow-sm backdrop-blur-md bg-white/95">

      {/* ================================================= */}
      {/* LEFT SECTION */}
      {/* ================================================= */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 bg-gray-50 active:scale-95 transition-transform cursor-pointer lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Browse Web */}

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

      {/* ================================================= */}
      {/* RIGHT SECTION */}
      {/* ================================================= */}

      <div className="flex items-center gap-4">

        {/* ================================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================================= */}

        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            onClick={() => {
              setShowNotificationMenu(
                !showNotificationMenu
              );

              setShowProfileMenu(false);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer ${
              showNotificationMenu
                ? "border-orange-500/30 bg-orange-500/5 text-orange-500"
                : "border-gray-100 hover:bg-gray-50 text-gray-600"
            }`}
          >
            <Bell className="w-4.5 h-4.5" />

            {/* Notification Dot */}

            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />

                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
              </span>
            )}
          </button>

          {/* ================================================= */}
          {/* NOTIFICATION DROPDOWN */}
          {/* ================================================= */}

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* Header */}

              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 mb-1">

                <span className="text-xs font-black text-gray-800">
                  Recent Notifications
                </span>

                <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-500/10 text-orange-600 rounded-md">
                  {unreadCount} New
                </span>
              </div>

              {/* ================================================= */}
              {/* NOTIFICATION LIST */}
              {/* ================================================= */}

              <div className="space-y-0.5 max-h-[280px] overflow-y-auto custom-scrollbar">

                {/* Loading */}

                {isNotificationsLoading && (
                  <>
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 p-2.5 rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse shrink-0" />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />

                          <div className="h-2.5 w-48 bg-gray-100 rounded animate-pulse" />

                          <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Error */}

                {!isNotificationsLoading &&
                  isNotificationsError && (
                    <div className="py-8 text-center px-4">
                      <XCircle className="w-7 h-7 mx-auto text-red-300 mb-2" />

                      <p className="text-xs font-bold text-red-500">
                        Failed to load notifications
                      </p>
                    </div>
                  )}

                {/* Empty */}

                {!isNotificationsLoading &&
                  !isNotificationsError &&
                  notifications.length === 0 && (
                    <div className="py-8 text-center">
                      <Bell className="w-7 h-7 mx-auto text-gray-300 mb-2" />

                      <p className="text-xs font-bold text-gray-400">
                        No notifications
                      </p>
                    </div>
                  )}

                {/* API Notifications */}

                {!isNotificationsLoading &&
                  !isNotificationsError &&
                  notifications.map((notification) => {

                    const NotifIcon =
                      getNotificationIcon(
                        notification.status
                      );

                    const iconColor =
                      getNotificationColor(
                        notification.status
                      );

                    return (
                      <div
                        key={notification.id}
                        onClick={() => {
                          setShowNotificationMenu(false);

                          navigate(
                            `/admin/order/${notification.order_id}`
                          );
                        }}
                        className="flex items-start gap-3 p-2.5 hover:bg-gray-50/80 rounded-xl transition-colors cursor-pointer group"
                      >

                        {/* Icon */}

                        <div
                          className={`p-2 rounded-lg shrink-0 ${iconColor}`}
                        >
                          <NotifIcon className="w-4 h-4" />
                        </div>

                        {/* Content */}

                        <div className="flex flex-col min-w-0 flex-1">

                          <span className="text-xs font-bold text-gray-800 group-hover:text-orange-500 transition-colors truncate">
                            {notification.title}
                          </span>

                          <span className="text-[11px] font-medium text-gray-500 leading-tight mt-0.5 line-clamp-2">
                            {notification.description}
                          </span>

                          <span className="text-[9px] font-semibold text-gray-400 mt-1">
                            {notification.time}
                          </span>

                        </div>

                      </div>
                    );
                  })}
              </div>

              {/* ================================================= */}
              {/* FOOTER */}
              {/* ================================================= */}

              <div className="p-1.5 border-t border-gray-50 mt-1">

                <button
                  onClick={() => {
                    setShowNotificationMenu(false);

                    // Change this route according to your
                    // notification page route.
                    navigate("/admin/orders");
                  }}
                  className="w-full py-2 text-center text-[11px] font-bold text-gray-500 hover:text-orange-500 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                >
                  View All Orders
                </button>

              </div>

            </div>
          )}
        </div>

        {/* Divider */}

        <span className="h-6 w-px bg-gray-200" />

        {/* ================================================= */}
        {/* ADMIN PROFILE */}
        {/* ================================================= */}

        <div
          className="relative"
          ref={profileRef}
        >
          <button
            onClick={() => {
              setShowProfileMenu(
                !showProfileMenu
              );

              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Profile Avatar Frame"
              className="h-8 w-8 rounded-lg object-cover ring-2 ring-gray-100 group-hover:ring-orange-500/20 transition-all"
            />

            <div className="hidden md:flex flex-col text-left">

              <span className="text-xs font-extrabold text-gray-800 leading-none mb-0.5">
                System Admin
              </span>

              <span className="text-[10px] font-bold text-orange-500">
                Super User
              </span>

            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                showProfileMenu
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">

              <div className="px-3 py-2 border-b border-gray-50 mb-1">

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Account Identity
                </p>

                <p className="text-xs font-bold text-gray-700 truncate">
                  admin@stackfood.com
                </p>

              </div>

              {/* <button className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <User className="w-4 h-4 text-gray-400" />
                My Profile
              </button> */}

              <button onClick={()=> navigate('/admin/settings')} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
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

                {isLoggingOut
                  ? "Terminating..."
                  : "Logout Session"}
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;