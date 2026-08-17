import api from "../../api/client";
import { get } from "../apiMethods";

export type ReportDateRange =
  | "today"
  | "week"
  | "month"
  | "custom";

export type ReportStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

// -----------------------------------------
// Pagination
// -----------------------------------------

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// -----------------------------------------
// Summary
// -----------------------------------------

export interface ReportSummary {
  total_sales: number;
  total_orders: number;
  completed_orders: number;
  average_order_value: number;
  success_rate: number;
}

// -----------------------------------------
// Status Counts
// -----------------------------------------

export interface ReportStatusCounts {
  pending: number;
  confirmed: number;
  preparing: number;
  ready_for_pickup: number;
  out_for_delivery: number;
  completed: number;
  cancelled: number;
}

// -----------------------------------------
// Timeline
// -----------------------------------------

export interface ReportTimeline {
  date: string;
  orders: number;
  revenue: number;
}

// -----------------------------------------
// Top Selling Items
// -----------------------------------------

export interface TopSellingItem {
  id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}

// -----------------------------------------
// Top Restaurants
// -----------------------------------------

export interface TopRestaurant {
  id: string;
  name: string;
  orders: number;
  revenue: number;
}

// -----------------------------------------
// Report Table Row
// -----------------------------------------

export interface ReportRow {
  id: string;
  order_code: string;
  restaurant_name: string;
  date: string;
  top_item: string;
  status: ReportStatus;
  total_amount: number;
}

// -----------------------------------------
// API Response
// -----------------------------------------

export interface ReportApiResponse {
  status: boolean;
  message: string;

  summary: ReportSummary;

  status_counts: ReportStatusCounts;

  timeline: ReportTimeline[];

  top_items: TopSellingItem[];

  top_restaurants: TopRestaurant[];

  data: ReportRow[];

  pagination: Pagination;
}

// -----------------------------------------
// Fetch Props
// -----------------------------------------

export interface ReportsFetchProps {
  page: number;
  per_page: number;

  search?: string;

  status?: ReportStatus;

  date_range?: ReportDateRange;

  start_date?: string;

  end_date?: string;
}

// -----------------------------------------
// Get Reports
// -----------------------------------------

export const ReportGet = (
  params: ReportsFetchProps
) => {
  return get<ReportApiResponse>(
    "/api/admin/reports",
    params
  );
};



export const ReportExportCsv = async (
  params: ReportsFetchProps
): Promise<Blob> => {
  const response = await api.get(
    "/api/admin/reports/export/csv",
    {
      params,
      responseType: "blob",
    }
  );

  return response.data;
};


export const ReportExportPdf = (
  params: ReportsFetchProps
) => {
  return get<Blob>(
    "/api/admin/reports/export/pdf",
    params
  );
};