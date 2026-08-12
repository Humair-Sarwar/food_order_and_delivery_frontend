import React from "react";
import { ShoppingBag, Heart, Clock, CheckCircle2, ArrowUpRight, Sparkles, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileInfo } from "../../../hooks/website/useProfile";

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isPending } = useProfileInfo();
  
    const profile = data?.data;

  // Quick stats summary
  const stats = [
    {
      title: "Total Orders",
      value: "12",
      change: "+2 this month",
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      title: "Wishlist Items",
      value: "3",
      change: "Saved favorites",
      icon: <Heart size={22} />,
      color: "bg-red-50 text-red-500 border-red-100",
    },
    {
      title: "Active Deliveries",
      value: "1",
      change: "On the way",
      icon: <Clock size={22} />,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  // Recent orders preview
  const recentOrders = [
    {
      id: "ORD-9843",
      restaurant: "Cheezious",
      date: "Aug 12, 2026",
      amount: 1800,
      status: "Processing",
    },
    {
      id: "ORD-9842",
      restaurant: "Spicy Treats",
      date: "Aug 10, 2026",
      amount: 2450,
      status: "Delivered",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-orange-950 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit">
            <Sparkles size={14} /> Welcome Back!
          </div>
       <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
  {isPending ? (
    <div className="w-64 h-10 bg-gray-800 rounded-lg animate-pulse" />
  ) : (
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
  )}
</h1>
          <p className="text-gray-400 text-sm font-medium max-w-md">
            Track your recent food deliveries, check your saved favorites, and manage your account details seamlessly.
          </p>
        </div>

        <button
          onClick={() => navigate("/food-items/All")}
          className="relative z-10 flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Utensils size={18} /> Order Food Now
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black text-gray-950">{stat.value}</h3>
              <p className="text-xs font-bold text-orange-600 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-950">Recent Orders</h3>
            <p className="text-xs font-semibold text-gray-400">Your latest food item orders status</p>
          </div>
          <button
            onClick={() => navigate("/customer/orders")}
            className="flex items-center gap-1 text-xs font-black text-orange-600 hover:text-orange-700 cursor-pointer group"
          >
            <span>View All</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gray-50/60 border border-gray-100 gap-4 hover:bg-orange-50/30 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-950 text-sm">{order.id}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold text-gray-400">{order.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Restaurant: <span className="text-orange-600 font-bold">{order.restaurant}</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-black text-gray-950 block">Rs. {order.amount}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    order.status === "Delivered" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/customer/orders")}
                  className="bg-white text-gray-950 border border-gray-200 hover:bg-gray-950 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;