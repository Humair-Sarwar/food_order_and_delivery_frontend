import { get } from "../apiMethods";


export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  active_restaurants: number;
  completed_orders: number;
}

export interface DashboardRecentOrder {
  id: string;
  order_number: string;
  customer: string;
  restaurant: string;
  amount: string;
  status: string;
  created_at: string | null;
}

export interface DashboardStatusCounts {
  pending: number;
  confirmed: number;
  preparing: number;
  ready_for_pickup: number;
  out_for_delivery: number;
  completed: number;
  cancelled: number;
}

export interface DashboardResponse {
  status: boolean;
  message: string;

  summary: DashboardSummary;

  recent_orders: DashboardRecentOrder[];

  status_counts: DashboardStatusCounts;
}

export const getDashboard =
  (): Promise<DashboardResponse> => {

    return get<DashboardResponse>(
      "/api/admin/dashboard"
    );
  };