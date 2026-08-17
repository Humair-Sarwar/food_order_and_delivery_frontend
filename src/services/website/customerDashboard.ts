import { get } from "../apiMethods";


export interface CustomerDashboardResponse {
  status: boolean;
  message: string;

  summary: {
    total_orders: number;
    wishlist_items: number;
    active_deliveries: number;
  };

  recent_orders: CustomerRecentOrder[];
}

export interface CustomerRecentOrder {
  id: string | number;
  order_number: string;
  restaurant: string;
  top_item: string;
  amount: string;
  status: string;
  created_at: string | null;
}

export const getCustomerDashboard = () => {
  return get<CustomerDashboardResponse>(
    "/api/web/user/customer/dashboard"
  );
};