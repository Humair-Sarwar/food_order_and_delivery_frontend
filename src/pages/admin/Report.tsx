import React, { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  BarChart3,
  LineChart as LineChartIcon,
  UtensilsCrossed,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  PackageOpen,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { SearchInput } from "../../components/admin/SearchInput";
import Pagination from "../../components/common/Pagination";



import type {
  ReportDateRange,
  ReportStatus,
} from "../../services/admin/reportService";
import { useReportExportCsv, useReportExportPdf, useReports } from "../../hooks/admin/useReports";

export const Report: React.FC = () => {
  const {
  mutate: exportCsv,
  isPending: isExporting,
} = useReportExportCsv();

const handleExportCsv = () => {
  exportCsv(
    {
      page: 1,
      per_page: 100,
      search: searchQuery || undefined,
      status: statusFilter,
      date_range: dateRange,
    },
    {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `orders-report-${new Date()
          .toISOString()
          .split("T")[0]}.csv`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
      },

      onError: (error) => {
        console.error("CSV export failed:", error);
      },
    }
  );
};


const {
  mutate: exportPdf,
  isPending: isExportingPdf,
} = useReportExportPdf();
  // =====================================================
  // STATE
  // =====================================================

  const [dateRange, setDateRange] =
    useState<ReportDateRange>("month");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<ReportStatus>("all");

  const [page, setPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  // =====================================================
  // REPORT API
  // =====================================================

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
  } = useReports({
    page,
    per_page: perPage,
    search: searchQuery || undefined,
    status: statusFilter,
    date_range: dateRange,
  });

  // =====================================================
  // API DATA
  // =====================================================

  const report = response;

  const summary =
    report?.summary;

  const timeline =
    report?.timeline ?? [];

  const topItems =
    report?.top_items ?? [];

  const reportData =
    report?.data ?? [];

  const pagination =
    report?.pagination;

  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    statusFilter,
    dateRange,
  ]);

  // =====================================================
  // DATE RANGE
  // =====================================================

  const handleDateRangeChange = (
    range: ReportDateRange
  ) => {
    setDateRange(range);
    setPage(1);
  };

  // =====================================================
  // STATUS FILTER
  // =====================================================

  const handleStatusChange = (
    status: ReportStatus
  ) => {
    setStatusFilter(status);
    setPage(1);
  };

  // =====================================================
  // PER PAGE
  // =====================================================

  const handlePerPageChange = (
    value: number
  ) => {
    setPerPage(value);
    setPage(1);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">

        <div className="h-32 rounded-2xl bg-gray-100" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-72 rounded-2xl bg-gray-100" />

        <div className="h-96 rounded-2xl bg-gray-100" />

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {
    return (
      <div className="w-full bg-white rounded-2xl border border-red-200 p-8 text-center">

        <XCircle
          size={40}
          className="mx-auto text-red-500 mb-3"
        />

        <h2 className="text-lg font-black text-gray-900">
          Failed to load reports
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading reports."}
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">

      {/* =====================================================
          SECTION 1: HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm">

        <div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider mb-2">

            <Sparkles size={12} />

            Unified Operations Dashboard

          </div>

          <h1 className="text-xl font-black text-gray-950 tracking-tight sm:text-2xl">
            Sales & Orders Master Report
          </h1>

          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Comprehensive financial turnover, transactional velocity, and item performance in a single view.
          </p>

        </div>

        {/* DATE RANGE */}

        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl border border-gray-200/60 overflow-x-auto self-start md:self-auto">

          {(
            [
              "today",
              "week",
              "month",
            ] as const
          ).map((range) => (

            <button
              key={range}
              onClick={() =>
                handleDateRangeChange(range)
              }
              className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                dateRange === range
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              {range === "today"
                ? "Today"
                : range === "week"
                ? "Week"
                : range === "month"
                ? "Month"
                : "Custom"}
            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          SECTION 2: SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TOTAL SALES */}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm flex items-center justify-between">

          <div className="space-y-1">

            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
              Total Sales
            </span>

            <span className="text-2xl font-black text-gray-950 tracking-tight block">
              Rs.{" "}
              {Number(
                summary?.total_sales ?? 0
              ).toLocaleString()}
            </span>

          </div>

          <div className="h-11 w-11 rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">

            <DollarSign
              size={20}
              className="stroke-[1.75]"
            />

          </div>

        </div>

        {/* TOTAL ORDERS */}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm flex items-center justify-between">

          <div className="space-y-1">

            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
              Total Orders
            </span>

            <span className="text-2xl font-black text-gray-950 tracking-tight block">
              {Number(
                summary?.total_orders ?? 0
              ).toLocaleString()}
            </span>

          </div>

          <div className="h-11 w-11 rounded-xl border bg-blue-50 border-blue-100 text-blue-600 flex items-center justify-center shrink-0">

            <ShoppingBag
              size={20}
              className="stroke-[1.75]"
            />

          </div>

        </div>

        {/* AVERAGE ORDER VALUE */}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm flex items-center justify-between">

          <div className="space-y-1">

            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
              Avg. Order Value
            </span>

            <span className="text-2xl font-black text-gray-950 tracking-tight block">
              Rs.{" "}
              {Number(
                summary?.average_order_value ?? 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

          </div>

          <div className="h-11 w-11 rounded-xl border bg-orange-50 border-orange-100 text-orange-600 flex items-center justify-center shrink-0">

            <TrendingUp
              size={20}
              className="stroke-[1.75]"
            />

          </div>

        </div>

        {/* SUCCESS RATE */}

        <div className="bg-white p-5 rounded-2xl border border-gray-200/85 shadow-sm flex items-center justify-between">

          <div className="space-y-1">

            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
              Success Rate
            </span>

            <span className="text-2xl font-black text-gray-950 tracking-tight block">
              {Number(
                summary?.success_rate ?? 0
              ).toFixed(1)}
              %
            </span>

          </div>

          <div className="h-11 w-11 rounded-xl border bg-purple-50 border-purple-100 text-purple-600 flex items-center justify-center shrink-0">

            <CheckCircle2
              size={20}
              className="stroke-[1.75]"
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          SECTION 3: ANALYTICS
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TIMELINE */}

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-sm font-black text-gray-950 uppercase tracking-wider">
                Revenue & Volume Timeline
              </h2>

              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Combined turnover growth across selected range
              </p>

            </div>

            <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">

              <LineChartIcon size={16} />

            </div>

          </div>

         {timeline.length > 0 ? (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={timeline}
        margin={{
          top: 10,
          right: 20,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{
            fontSize: 11,
          }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          yAxisId="revenue"
          tick={{
            fontSize: 11,
          }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          yAxisId="orders"
          orientation="right"
          tick={{
            fontSize: 11,
          }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip />

        <Legend />

        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#f97316"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />

        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          name="Orders"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
) : (
  <div className="h-72 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-4">
    <TrendingUp
      size={32}
      className="text-gray-300 mb-2"
    />

    <p className="text-xs font-bold text-gray-700">
      No timeline data
    </p>

    <p className="text-[11px] font-medium text-gray-400 mt-0.5">
      No orders found for this date range.
    </p>
  </div>
)}

        </div>

        {/* TOP ITEMS */}

        <div className="bg-white p-6 rounded-2xl border border-gray-200/85 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-sm font-black text-gray-950 uppercase tracking-wider">
                Top Selling Items
              </h2>

              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Revenue contributors
              </p>

            </div>

            <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">

              <BarChart3 size={16} />

            </div>

          </div>

          {topItems.length > 0 ? (

            <div className="space-y-4">

              {topItems.map((item) => {

                const maxRevenue =
                  Math.max(
                    ...topItems.map(
                      (x) =>
                        Number(
                          x.revenue
                        )
                    ),
                    1
                  );

                const percentage =
                  (Number(item.revenue) /
                    maxRevenue) *
                  100;

                return (

                  <div key={item.id}>

                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">

                      <span className="truncate mr-2">
                        {item.name}
                      </span>

                      <span className="font-mono text-gray-950 shrink-0">
                        Rs.{" "}
                        {Number(
                          item.revenue
                        ).toLocaleString()}
                      </span>

                    </div>

                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">

                      <div
                        className="bg-orange-500 h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <div className="text-[10px] text-gray-400 font-semibold mt-1">
                      {item.quantity_sold} sold
                    </div>

                  </div>

                );
              })}

            </div>

          ) : (

            <div className="py-10 text-center">

              <PackageOpen
                size={28}
                className="mx-auto text-gray-300 mb-2"
              />

              <p className="text-xs font-bold text-gray-500">
                No item data
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          SECTION 4: SEARCH + FILTER
      ===================================================== */}

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

        <div className="flex flex-wrap items-center gap-3">

          {/* STATUS FILTER */}

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200/50 overflow-x-auto">

            {(
              [
                "all",
                "pending",
                "confirmed",
                "preparing",
                "ready_for_pickup",
                "out_for_delivery",
                "completed",
                "cancelled",
              ] as const
            ).map((status) => (

              <button
                key={status}
                onClick={() =>
                  handleStatusChange(status)
                }
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-950"
                }`}
              >
                {status.replaceAll("_", " ")}
              </button>

            ))}

          </div>

          {/* EXPORT */}

          <div className="flex items-center gap-2">

            <button
  onClick={handleExportCsv}
  disabled={isExporting}
  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Download
    size={14}
    className="text-gray-500"
  />

  <span>
    {isExporting ? "Downloading..." : "CSV"}
  </span>
</button>

            <button
  disabled={isExportingPdf}
  onClick={() => {
    exportPdf(
      {
        page: 1,
        per_page: 100,
        search: searchQuery || undefined,
        status: statusFilter,
        date_range: dateRange,
      },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");

          link.href = url;
          link.download = `sales-report-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`;

          document.body.appendChild(link);

          link.click();

          link.remove();

          window.URL.revokeObjectURL(url);
        },
      }
    );
  }}
  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 text-xs font-bold text-white hover:bg-orange-700 transition-colors shadow-sm shadow-orange-600/20 cursor-pointer disabled:opacity-50"
>
  <FileText size={14} />

  <span>
    {isExportingPdf ? "Generating..." : "PDF"}
  </span>
</button>

          </div>

        </div>

      </div>

      {/* =====================================================
          FETCHING INDICATOR
      ===================================================== */}

      {isFetching && (
        <div className="text-xs font-semibold text-gray-400">
          Updating report...
        </div>
      )}

      {/* =====================================================
          SECTION 5: REPORT TABLE
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200/85 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full border-collapse text-left">

            <thead>

              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 select-none">

                <th className="py-3.5 px-6">
                  Order Code
                </th>

                <th className="py-3.5 px-6">
                  Restaurant Name
                </th>

                <th className="py-3.5 px-6">
                  Timestamp
                </th>

                <th className="py-3.5 px-6">
                  Top Item
                </th>

                <th className="py-3.5 px-6 text-center">
                  Status Flag
                </th>

                <th className="py-3.5 px-6 text-right">
                  Total Amount (Sales)
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">

              {reportData.length > 0 ? (

                reportData.map((row) => (

                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/40 transition-colors group"
                  >

                    {/* ORDER */}

                    <td className="py-4 px-6 font-mono font-bold text-xs text-gray-950 group-hover:text-orange-600 transition-colors">
                      {row.order_code}
                    </td>

                    {/* RESTAURANT */}

                    <td className="py-4 px-6 font-bold text-gray-900">
                      {row.restaurant_name}
                    </td>

                    {/* DATE */}

                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                      {row.date}
                    </td>

                    {/* TOP ITEM */}

                    <td className="py-4 px-6">

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">

                        <UtensilsCrossed
                          size={12}
                        />

                        {row.top_item}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="py-4 px-6 text-center">

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          row.status === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : row.status === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : row.status === "cancelled"
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >

                        {row.status ===
                        "completed" ? (
                          <CheckCircle2
                            size={10}
                          />
                        ) : row.status ===
                          "pending" ? (
                          <Clock
                            size={10}
                          />
                        ) : row.status ===
                          "cancelled" ? (
                          <XCircle
                            size={10}
                          />
                        ) : (
                          <Clock
                            size={10}
                          />
                        )}

                        <span>
                          {row.status.replaceAll(
                            "_",
                            " "
                          )}
                        </span>

                      </span>

                    </td>

                    {/* AMOUNT */}

                    <td className="py-4 px-6 text-right font-mono font-black text-gray-950 text-xs">
                      Rs.{" "}
                      {Number(
                        row.total_amount
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="py-16 text-center"
                  >

                    <PackageOpen
                      size={32}
                      className="text-gray-300 mx-auto mb-2 stroke-[1.5]"
                    />

                    <p className="text-sm font-bold text-gray-700">
                      No matching report entries found
                    </p>

                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                      Adjust your search or filter parameters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          SECTION 6: PAGINATION
      ===================================================== */}

      {pagination && (

        <Pagination
          currentPage={
            pagination.current_page
          }
          totalPages={
            pagination.last_page
          }
          totalEntries={
            pagination.total
          }
          from={
            pagination.from
          }
          to={
            pagination.to
          }
          entriesPerPage={
            pagination.per_page
          }
          onPageChange={(pageNumber) =>
            setPage(pageNumber)
          }
          onEntriesPerPageChange={
            handlePerPageChange
          }
        />

      )}

    </div>
  );
};

export default Report;