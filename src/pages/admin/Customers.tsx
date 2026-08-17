import React, { useState, useMemo } from "react";
import { 
  Search, 
  UserPlus, 
  Download, 
  SlidersHorizontal, 
  MoreVertical, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CircleDot,
  UserCheck,
  UserX,
  Loader2
} from "lucide-react";
import { useCustomerFetch } from "../../hooks/admin/useCustomer";
import Pagination from "../../components/common/Pagination";
import { SearchInput } from "../../components/admin/SearchInput";

// --- TypeScript Interfaces matching your actual API ---
export interface CustomerAPIResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string | null;
  image: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  status?: "active" | "suspended";
  total_orders?: number;
  total_sale?: number;
}

export interface CustomerAPIROOTResponse {
  status: boolean;
  message: string;
  data: CustomerAPIResponse[];
  summary: {
    total_customers: number;
    total_orders: number;
    total_sale: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export const Customers: React.FC = () => {
  // --- Hook & Query States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // --- Remote Data Fetch via Custom Hook ---
  const { data, isLoading, error } = useCustomerFetch({
    page,
    per_page: perPage,
    search: searchQuery,
  }) as { data: CustomerAPIROOTResponse | undefined; isLoading: boolean; error: any };

  // --- Safely extract array and pagination/summary metrics from API response ---
  const rawCustomerList: CustomerAPIResponse[] = data?.data ?? [];
  const pagination = data?.pagination;
  const summary = data?.summary;

  // --- Filter customer list locally by status if needed ---
  const customerList = useMemo(() => {
    if (statusFilter === "all") return rawCustomerList;
    return rawCustomerList.filter(c => (c.status ?? "active") === statusFilter);
  }, [rawCustomerList, statusFilter]);

  // --- Dynamic Analytics Summary Card Matrices using API summary block ---
  const stats = useMemo(() => {
    const totalAccounts = summary?.total_customers ?? pagination?.total ?? 0;
    const totalOrdersCount = summary?.total_orders ?? 0;
    const totalSpentSum = summary?.total_sale ?? 0;
    
    // Calculate total active customers from the fetched list or fallback
    const totalActiveCount = rawCustomerList.filter(c => (c.status ?? "active") === "active").length;

    return [
      { label: "Total Accounts", value: totalAccounts, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
      { label: "Total Orders", value: totalOrdersCount, icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
      { label: "Ecosystem Spend", value: `Rs. ${totalSpentSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-orange-600 bg-orange-50 border-orange-100" },
      { label: "Total Active", value: totalActiveCount, icon: UserCheck, color: "text-purple-600 bg-purple-50 border-purple-100" }
    ];
  }, [summary, pagination, rawCustomerList]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* SECTION 1: Header Operations Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">Customer Management</h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Monitor ecosystem consumer metrics, adjust structural states, and review individual order values.
          </p>
        </div>
      </div>

      {/* SECTION 2: Live Analytics Aggregation Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">{stat.label}</span>
                <span className="text-2xl font-black text-gray-900 tracking-tight block">{stat.value}</span>
              </div>
              <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}>
                <IconComponent size={20} className="stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: Filter / Query Control Line */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/85 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md w-full">
          <SearchInput
            value={searchQuery}
            onChangeValue={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200/50 shrink-0">
            {(["all", "active", "suspended"] as const).map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Boundary Notification Block */}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs font-bold">
          Failed to sync user datasets. Please verify system connection endpoints.
        </div>
      )}

      {/* SECTION 4: Data Table Grid Core */}
      <div className="bg-white rounded-2xl border border-gray-200/85 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 select-none">
                <th className="py-3.5 px-6">Customer Profile</th>
                <th className="py-3.5 px-6">Anchor Location</th>
                <th className="py-3.5 px-6 text-center">Orders Placed</th>
                <th className="py-3.5 px-6 text-right">Gross Value</th>
                <th className="py-3.5 px-6 text-center">Status Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-xs font-semibold">
                    <Loader2 className="animate-spin mx-auto mb-2 text-orange-500" size={24} />
                    Synchronizing system customer maps...
                  </td>
                </tr>
              ) : customerList.length > 0 ? (
                customerList.map((customer) => {
                  const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown User";
                  
                  const initials = customer.first_name && customer.last_name 
                    ? `${customer.first_name[0]}${customer.last_name[0]}` 
                    : customer.first_name?.[0] || "?";

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 font-black text-xs flex items-center justify-center uppercase shrink-0 tracking-tight overflow-hidden">
  {customer?.image ? (
    <img
      src={`${import.meta.env.VITE_API_BASE_URL}/storage/${customer.image}`}
      alt={`${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    initials
  )}
</div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-800 tracking-tight truncate group-hover:text-orange-600 transition-colors">
                              {fullName}
                            </span>
                            <span className="text-[11px] font-medium text-gray-400 mt-0.5 inline-flex items-center gap-1.5 flex-wrap">
                              {customer.phone && (
                                <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold">
                                  {customer.phone}
                                </span>
                              )}
                              {customer.phone && <span className="text-gray-300">•</span>}
                              <span className="inline-flex items-center gap-1 text-gray-500">
                                <Mail size={11} className="text-gray-400 shrink-0" /> {customer.email}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 inline-flex items-center gap-1 text-xs">
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            <span>No Location</span>
                          </span>
                          <span className="text-[11px] font-medium text-gray-400 inline-flex items-center gap-1 mt-0.5">
                            <Calendar size={11} className="text-gray-300 shrink-0" />
                            Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center font-mono font-bold text-gray-800 text-xs">
                        {customer.total_orders ?? 0}
                      </td>

                      <td className="py-4 px-6 text-right font-mono font-black text-gray-900 text-xs">
                        Rs. {(customer.total_sale ?? 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          (customer.status ?? "active") === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}>
                          <CircleDot size={6} className="fill-current" />
                          <span>{customer.status ?? "active"}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <UserX size={32} className="text-gray-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-sm font-bold text-gray-700">No matching consumer profiles found</p>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                      Adjust your search keyword nodes or clear filter structures to query further data partitions.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Integrated Custom Pagination Widget Component */}
      {!isLoading && customerList.length > 0 && pagination && pagination.last_page > 0 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          totalEntries={pagination.total}
          from={pagination.from ?? 0}
          to={pagination.to ?? 0}
          entriesPerPage={pagination.per_page}
          onPageChange={(targetPage) => setPage(targetPage)}
          onEntriesPerPageChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default Customers;