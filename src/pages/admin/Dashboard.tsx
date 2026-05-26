import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  UtensilsCrossed, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  
  // High-level structural stats for StackFood system metrics
  const stats = [
    {
      title: "Total Revenue",
      value: "$42,894.50",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
    },
    {
      title: "Total Orders",
      value: "1,482",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingBag,
      color: "bg-orange-500/10 text-orange-600 border-orange-500/10"
    },
    {
      title: "Active Restaurants",
      value: "148",
      change: "+4.1%",
      isPositive: true,
      icon: UtensilsCrossed,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/10"
    },
    {
      title: "System Commission",
      value: "$8,579.00",
      change: "-2.4%",
      isPositive: false,
      icon: TrendingUp,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/10"
    }
  ];

  // Dummy current active orders data list matrix
  const recentOrders = [
    {
      id: "#ORD-9402",
      customer: "Bilal Khan",
      restaurant: "Spicy Bytes",
      amount: "$42.50",
      status: "Delivered",
      statusIcon: CheckCircle2,
      statusClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    {
      id: "#ORD-9401",
      customer: "Ayesha Ahmed",
      restaurant: "Pizza Wave",
      amount: "$18.90",
      status: "Pending",
      statusIcon: Clock,
      statusClass: "bg-amber-500/10 text-amber-600 border-amber-500/20"
    },
    {
      id: "#ORD-9400",
      customer: "Zainab Raza",
      restaurant: "Burger Lab",
      amount: "$31.00",
      status: "Processing",
      statusIcon: Clock,
      statusClass: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      id: "#ORD-9399",
      customer: "Hamza Malik",
      restaurant: "Subway Junction",
      amount: "$12.40",
      status: "Canceled",
      statusIcon: XCircle,
      statusClass: "bg-red-500/10 text-red-600 border-red-500/20"
    }
  ];

  // Top performing restaurants checklist roster
  const topRestaurants = [
    { name: "Burger Lab", orders: 482, rating: "4.9", sales: "$8,290" },
    { name: "Pizza Wave", orders: 391, rating: "4.7", sales: "$6,540" },
    { name: "Spicy Bytes", orders: 312, rating: "4.8", sales: "$5,810" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. DASHBOARD WELCOME HEADER ROW SECTION */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
            Dashboard Overview
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Real-time platform logs, analytical insights, and operational metrics.
          </p>
        </div>
        
        {/* Dynamic Live Sync Badge Hook */}
        <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 shadow-sm text-[11px] font-bold text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>Live Data Feed</span>
        </div>
      </div>

      {/* 2. ANALYTICS METRICS STATS CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color} transition-transform group-hover:scale-105 duration-300`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    {stat.value}
                  </span>
                </div>

                {/* Performance Delta Trend Capsule */}
                <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] font-black border ${
                  stat.isPositive 
                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' 
                    : 'bg-red-500/5 text-red-600 border-red-500/10'
                }`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>

              {/* Absolute Bottom Border Accent Graphic Flare */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      {/* 3. CORE ANALYTICAL DOCK MATRIX GRIDS (TABLE & HIGHLIGHTS) */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* LEFT COMPONENT COLUMN MAP: Recent Orders Registry Data Table */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-gray-800">Recent System Orders</h2>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">Incoming user culinary routing queues.</p>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-black text-orange-500 hover:text-orange-600 transition-colors cursor-pointer group">
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Desktop Matrix Native Tabular Node Viewport */}
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Restaurant</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                {recentOrders.map((order, idx) => {
                  const StatusIcon = order.statusIcon;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="px-6 py-4 font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-500">{order.restaurant}</td>
                      <td className="px-6 py-4 font-extrabold text-gray-900">{order.amount}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.statusClass}`}>
                          <StatusIcon className="w-3 h-3 shrink-0" />
                          <span>{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-500/30 bg-white transition-all cursor-pointer active:scale-95">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN MAP: Top Performing Restaurants Sidebar Panel */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-sm font-black text-gray-800">Top Performing Vendors</h2>
            <p className="text-[11px] font-bold text-gray-400 mt-0.5">Highest order conversions this cycle.</p>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {topRestaurants.map((restaurant, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-500/10 hover:bg-orange-500/[0.01] transition-all group"
              >
                <div className="flex items-center gap-3">
                  {/* Performance Ranking Circle Token */}
                  <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-black text-gray-500 group-hover:bg-orange-500/10 group-hover:text-orange-600 group-hover:border-transparent transition-colors">
                    #{idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">{restaurant.name}</span>
                    <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
                      {restaurant.orders} total orders
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-extrabold text-gray-900">{restaurant.sales}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/10 mt-0.5">
                    ⭐ {restaurant.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;