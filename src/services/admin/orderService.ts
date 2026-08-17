import type { ApiResponse } from "../../api/client";
import api from "../../api/client";
import { get, patch } from "../apiMethods";

// =====================================================
// PAGINATION
// =====================================================

export interface AdminOrderPagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

// =====================================================
// CUSTOMER
// =====================================================

export interface AdminOrderCustomer {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

// =====================================================
// RESTAURANT
// =====================================================

export interface AdminOrderRestaurant {
  id: string;
  name: string;
  slug?: string;
}

// =====================================================
// FOOD ITEM
// =====================================================

export interface AdminOrderFoodItem {
  id: string;
  title: string;
  slug?: string;

  image?: {
    id: string;
    media_path: string;
  } | null;

  category?: {
    id: string;
    title: string;
  } | null;
}

// =====================================================
// ORDER ITEM
// =====================================================

export interface AdminOrderItem {
  id: string;
  order_id: string;
  food_item_id: string;

  food_item_name?: string;

  unit_price: number | string;
  quantity: number;
  item_total: number | string;

  food_item?: AdminOrderFoodItem | null;
}

// =====================================================
// ORDER
// =====================================================

export interface AdminOrder {
  id: string;
  user_id: string;
  restaurant_id: string;

  order_number: string;

  status: string;
  payment_status: string;

  delivery_method: "self_pickup" | "ship";
  payment_method: "cod" | "online";

  first_name?: string | null;
  last_name?: string | null;

  address?: string | null;
  apartment?: string | null;
  city?: string | null;
  postcode?: string | null;
  phone?: string | null;
  country?: string | null;

  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;

  created_at?: string;
  updated_at?: string;

  customer?: AdminOrderCustomer | null;

  restaurant?: AdminOrderRestaurant | null;

  items?: AdminOrderItem[];
}

// =====================================================
// RESPONSE
// =====================================================

export interface AdminOrderListsResponse {
  data: AdminOrder[];
  pagination: AdminOrderPagination;
}

// =====================================================
// PARAMS
// =====================================================

export interface AdminOrderListsParams {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  payment_method?: any;
}

// =====================================================
// ADMIN ORDER LIST
// =====================================================

export const AdminOrderLists = (
  params?: AdminOrderListsParams
): Promise<ApiResponse<AdminOrderListsResponse>> => {
  return get<ApiResponse<AdminOrderListsResponse>>(
    "/api/admin/orders",
    params
  );
};






// =====================================================
// ADMIN ORDER DETAILS PARAMS
// =====================================================

export interface AdminOrderDetailsParams {
  order_id: string;
}

// =====================================================
// ADMIN ORDER DETAILS
// =====================================================

export const AdminOrderDetails = (
  params: AdminOrderDetailsParams
): Promise<ApiResponse<AdminOrder>> => {
  return get<ApiResponse<AdminOrder>>(
    `/api/admin/orders/details/${params.order_id}`,
  );
};








// =====================================================
// UPDATE ORDER STATUS PARAMS
// =====================================================

export interface AdminOrderStatusUpdateParams {
  order_id: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready_for_pickup"
    | "out_for_delivery"
    | "completed"
    | "cancelled";
}

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export const AdminOrderStatusUpdate = (
  params: AdminOrderStatusUpdateParams
): Promise<ApiResponse<AdminOrder>> => {
  return patch<ApiResponse<AdminOrder>>(
    `/api/admin/orders/${params.order_id}/status`,
    {
      status: params.status,
    }
  );
};


export interface OrdersFetchProps {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  payment_method?: string;
}

export const OrderExportCsv = async (
  params: OrdersFetchProps
): Promise<Blob> => {
  const response = await api.get(
    "/api/admin/orders/export/csv",
    {
      params,
      responseType: "blob",
    }
  );

  return response.data;
};