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
  // Fallbacks if your API updates statuses/metrics down the line
  status?: "active" | "suspended";
  total_orders?: number;
  total_spent?: number;
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
  });

  // FIX 1: Safely extract array from data.data based on your json payload
  const customerList: CustomerAPIResponse[] = data?.data ?? [];

  // --- Dynamic Analytics Summary Card Matrices ---
  const stats = useMemo(() => {
    const total = data?.pagination?.total ?? 0;
    const activeCount = customerList.filter(c => (c.status ?? "active") === "active").length;
    const totalSpentSum = customerList.reduce((acc, c) => acc + (c.total_spent ?? 0), 0);

    return [
      { label: "Total Accounts", value: total, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
      { label: "Active Samples", value: activeCount, icon: UserCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
      { label: "Ecosystem Spend", value: `Rs: ${totalSpentSum.toLocaleString()}`, icon: TrendingUp, color: "text-orange-600 bg-orange-50 border-orange-100" },
      { label: "Avg. Values", value: `Rs: ${total ? (totalSpentSum / customerList.length || 0).toFixed(2) : "0.00"}`, icon: ShoppingBag, color: "text-purple-600 bg-purple-50 border-purple-100" }
    ];
  }, [customerList, data?.pagination?.total]);

  return (
    <div className="space-y-6 w-full">
      
      {/* SECTION 1: Header Operations Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Monitor ecosystem consumer metrics, adjust structural states, and review individual order values.
          </p>
        </div>
  
      </div>

      {/* SECTION 2: Live Analytics Aggregation Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">{stat.label}</span>
                <span className="text-2xl font-black text-gray-900 tracking-tight block">{stat.value}</span>
              </div>
              <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <IconComponent size={20} className="stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: Filter / Query Control Line */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
       

        <SearchInput
                      value={searchQuery}
                      onChangeValue={(value) => {
                        setSearchQuery(value);
                        setPage(1);
                      }}
                    />

        <div className="flex items-center gap-3 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200/40 shrink-0">
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 select-none">
                <th className="py-3.5 px-5">Customer Profile</th>
                <th className="py-3.5 px-5">Anchor Location</th>
                <th className="py-3.5 px-5 text-center">Orders Placed</th>
                <th className="py-3.5 px-5 text-right">Gross Value</th>
                <th className="py-3.5 px-5 text-center">Status Flag</th>
                {/* <th className="py-3.5 px-5 text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-xs">
                    <Loader2 className="animate-spin mx-auto mb-2 text-orange-500" size={24} />
                    Synchronizing system customer maps...
                  </td>
                </tr>
              ) : customerList.length > 0 ? (
                customerList.map((customer) => {
                  // FIX 2: Compute full name cleanly
                  const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown User";
                  
                  // Handle potential missing letters for initial fallback icon
                  const initials = customer.first_name && customer.last_name 
                    ? `${customer.first_name[0]}${customer.last_name[0]}` 
                    : customer.first_name?.[0] || "?";

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 font-black text-xs flex items-center justify-center uppercase shrink-0 tracking-tight">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-800 tracking-tight truncate group-hover:text-orange-600 transition-colors">
                              {fullName}
                            </span>
                            <span className="text-[11px] font-medium text-gray-400 mt-0.5 inline-flex items-center gap-1.5">
                              {customer.phone && <span className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-bold">
                                {customer.phone}
                              </span>}
                              • <Mail size={11} className="text-gray-300" /> {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 inline-flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            {"No Location"}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400 inline-flex items-center gap-1 mt-0.5">
                            <Calendar size={11} className="text-gray-300 shrink-0" />
                            Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center font-mono font-bold text-gray-800">
                        {customer.total_orders ?? 0}
                      </td>

                      <td className="py-4 px-5 text-right font-mono font-black text-gray-900">
                        Rs: {(customer.total_spent ?? 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          (customer.status ?? "active") === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}>
                          <CircleDot size={8} className="fill-current" />
                          {customer.status ?? "active"}
                        </span>
                      </td>

                      {/* <td className="py-4 px-5 text-right">
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer">
                          <MoreVertical size={14} />
                        </button>
                      </td> */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
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
{/* SECTION 5: Integrated Custom Pagination Widget component */}
        {!isLoading && customerList.length > 0 && data?.pagination && (
          <Pagination
            currentPage={data.pagination.current_page}
            totalPages={data.pagination.last_page}
            totalEntries={data.pagination.total}
            from={data.pagination.from ?? 0}
            to={data.pagination.to ?? 0}
            entriesPerPage={data.pagination.per_page}
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