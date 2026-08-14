import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowDownToLine, 
  CreditCard, 
  Wallet,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { GenericTable } from '../../../components/common/GenericTable';
import Pagination from '../../../components/common/Pagination';
import { useAdminOrderLists } from '../../../hooks/admin/useOrder';
import { useNavigate } from 'react-router-dom';

// --- TypeScript Interfaces ---
export interface OrderCustomer {
  name: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  order_number: string;
  date: string;
  customer: OrderCustomer;
  restaurant: string;
  amount: string;
  payment: string;
  status: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  statusClass: string;
}

export interface TabConfig {
  name: string;
  count: string;
  color: string;
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const navigate = useNavigate()
  const {
    data,
    isPending,
    isError,
  } = useAdminOrderLists({
    page,
    per_page: perPage,
    search: searchQuery || undefined,
    status: activeTab !== 'All' ? activeTab.toLowerCase() : undefined,
    payment_method: paymentFilter || undefined,
  });

  const rawOrders: any = data?.data || [];
  const pagination: any = data?.pagination;

  // Status Tab Configuration
  const tabs: TabConfig[] = [
    { name: 'All', count: pagination?.total?.toString() || '0', color: 'bg-gray-100 text-gray-700' },
    { name: 'Pending', count: '12', color: 'bg-amber-500/10 text-amber-600' },
    { name: 'Processing', count: '8', color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Delivered', count: '1,430', color: 'bg-emerald-500/10 text-emerald-600' },
    { name: 'Canceled', count: '32', color: 'bg-red-500/10 text-red-600' }
  ];

  // Map API response to OrderItem format
  const ordersData: OrderItem[] = useMemo(() => {
    return rawOrders?.map((order: any) => {
      const statusLower = (order.status || 'pending').toLowerCase();
      let statusLabel = 'Pending';
      let statusClass = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      let StatusIcon = Clock;

      if (statusLower === 'delivered') {
        statusLabel = 'Delivered';
        statusClass = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        StatusIcon = CheckCircle2;
      } else if (statusLower === 'processing') {
        statusLabel = 'Processing';
        statusClass = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        StatusIcon = Clock;
      } else if (statusLower === 'canceled' || statusLower === 'cancelled') {
        statusLabel = 'Canceled';
        statusClass = 'bg-red-500/10 text-red-600 border-red-500/20';
        StatusIcon = XCircle;
      }

      const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A';

      const customerName = order.user
        ? `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim()
        : order.first_name
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : 'Guest User';

      const customerPhone = order.phone || order.user?.phone || 'N/A';

      return {
        id: order.id,
        order_number: order.order_number || `#ORD-${order.id.slice(0, 6)}`,
        date: formattedDate,
        customer: { name: customerName || 'Unknown', phone: customerPhone },
        restaurant: order.restaurant?.name || 'Unknown Restaurant',
        amount: `Rs. ${Number(order.total || 0).toFixed(2)}`,
        payment: order.payment_method ? order.payment_method.toUpperCase() : 'COD',
        status: statusLabel,
        icon: StatusIcon,
        statusClass,
      };
    });
  }, [rawOrders]);

  // --- GenericTable Column Definitions ---
  const columns = useMemo(() => [
    {
      header: "Order ID",
      key: "order_number",
      accessorKey: "order_number",
      dataIndex: "order_number",
      className: "px-6 py-4 font-black text-gray-900 group-hover:text-orange-500 transition-colors",
      render: (order: OrderItem) => order.order_number
    },
    {
      header: "Timeline",
      key: "timeline",
      accessorKey: "date",
      dataIndex: "date",
      className: "px-6 py-4 text-gray-500 whitespace-nowrap",
      render: (order: OrderItem) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{order.date}</span>
        </div>
      )
    },
    {
      header: "Customer Details",
      key: "customer",
      accessorKey: "customer",
      dataIndex: "customer",
      className: "px-6 py-4",
      render: (order: OrderItem) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{order.customer?.name}</span>
          <span className="text-[10px] font-medium text-gray-400 mt-0.5">{order.customer?.phone}</span>
        </div>
      )
    },
    {
      header: "Restaurant",
      key: "restaurant",
      accessorKey: "restaurant",
      dataIndex: "restaurant",
      className: "px-6 py-4 font-bold text-gray-600 whitespace-nowrap",
      render: (order: OrderItem) => order.restaurant
    },
    {
      header: "Amount",
      key: "amount",
      accessorKey: "amount",
      dataIndex: "amount",
      className: "px-6 py-4 font-extrabold text-gray-900",
      render: (order: OrderItem) => order.amount
    },
    {
      header: "Method",
      key: "method",
      accessorKey: "payment",
      dataIndex: "payment",
      className: "px-6 py-4 whitespace-nowrap",
      render: (order: OrderItem) => (
        <div className="flex items-center gap-1.5 text-gray-500">
          {order.payment === 'COD' || order.payment === 'CASH' ? (
            <Wallet className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <CreditCard className="w-3.5 h-3.5 text-blue-500" />
          )}
          <span className="text-[11px] font-bold">{order.payment}</span>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      accessorKey: "status",
      dataIndex: "status",
      className: "px-6 py-4 whitespace-nowrap",
      render: (order: OrderItem) => {
        const StatusIcon = order.icon;
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.statusClass}`}>
            <StatusIcon className="w-3 h-3 shrink-0" />
            <span>{order.status}</span>
          </div>
        );
      }
    },
    {
      header: "Actions",
      key: "actions",
      accessorKey: "actions",
      dataIndex: "actions",
      className: "px-6 py-4 text-center whitespace-nowrap",
      render: (order: OrderItem) => (
        <button 
          onClick={() => {
            navigate(`/admin/order/${order?.id}`)
          }}
          className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-500/30 bg-white shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. HEADER TITLE SECTION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
            Order Registry
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Manage customer request pipelines, track dispatch logs, and oversee payouts.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 h-10 text-xs font-bold bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer self-start sm:self-auto">
          <ArrowDownToLine className="w-4 h-4 text-gray-400" />
          <span>Export Manifest</span>
        </button>
      </div>

      {/* 2. DYNAMIC SEGMENTED STATUS TABS ROW */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
              activeTab === tab.name
                ? 'bg-orange-500 border-transparent text-white shadow-md shadow-orange-500/20'
                : 'bg-white border-gray-200/80 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.name}</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${
              activeTab === tab.name ? 'bg-white/20 text-white' : tab.color
            }`}>
              {tab.name === 'All' ? pagination?.total || tab.count : tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. SEARCH AND ADVANCED FILTERS DOCK BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white border border-gray-200/80 p-3 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Order ID, customer name, restaurant..."
            className="w-full h-10 pl-10 pr-4 text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="w-full appearance-none text-xs font-semibold px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 transition-all cursor-pointer shadow-sm text-gray-700"
          >
            <option value="">Payment All</option>
            <option value="cod">Cash (COD)</option>
            <option value="online">Online / Card</option>
          </select>
          <SlidersHorizontal size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* 4. ORDERS MASTER DATA MATRIX TABLE CARD */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400">
            Loading orders registry...
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-xs font-bold text-red-500">
            Failed to retrieve orders data. Please try again.
          </div>
        ) : (
          <GenericTable
            data={ordersData}
            columns={columns as any}
            rowKey={(order: OrderItem) => order.id}
            iconNo={<ShoppingBag className="w-[40px] h-[40px] text-gray-300" />}
            emptyMessage="No records found matching current query configuration."
          />
        )}
      </div>

      {/* 5. INTEGRATED CUSTOM PAGINATION COMPONENT */}
      {pagination && pagination.last_page > 0 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.last_page}
          totalEntries={pagination.total}
          from={pagination.from}
          to={pagination.to}
          entriesPerPage={perPage}
          onPageChange={(targetPage) => setPage(targetPage)}
          onEntriesPerPageChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}