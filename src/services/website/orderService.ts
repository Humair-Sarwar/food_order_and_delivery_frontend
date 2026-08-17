import type { ApiResponse } from "../../api/client";
import { get, post } from "../apiMethods";

// ==================== PLACE ORDER ====================

export interface ShippingAddress {
  country: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  phone: string;
}

export interface PlaceOrderPayload {
  cart_id: string;
  delivery_method: "self_pickup" | "ship";
  payment_method: "cod" | "online";
  shipping_address?: ShippingAddress| null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  quantity: number;
  unit_price: number;
  item_total: number;
  food_item?: any;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  cart_id: string | null;

  order_number?: string;

  delivery_method: "self_pickup" | "ship";
  payment_method: "cod" | "online";

  status?: string;

  subtotal: number;
  delivery_fee: number;
  total: number;

  shipping_address?: ShippingAddress | null;

  created_at?: string;
  updated_at?: string;

  items?: OrderItem[];
  restaurant?: {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
  };
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  apartment?: string | null;
  city?: string;
  country?: string;
  postcode?: string;
}

export interface PlaceOrderResponse {
  status: boolean;
  message: string;
  data: Order;
}

export const placeOrder = (
  data: PlaceOrderPayload
): Promise<PlaceOrderResponse> => {
  return post<PlaceOrderResponse>(
    "/api/web/user/orders",
    data
  );
};


// ==================== GET ORDER DETAILS ====================

export interface OrderDetailsResponse {
  status: boolean;
  message: string;
  data: Order;
}

export const getOrderDetails = (
  orderId: string
): Promise<OrderDetailsResponse> => {
  return get<OrderDetailsResponse>(
    `/api/web/user/orders/${orderId}`
  );
};





















export interface OrderPagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

// =====================================================
// RESTAURANT
// =====================================================

export interface OrderRestaurant {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
}

// =====================================================
// FOOD ITEM
// =====================================================

export interface OrderFoodItem {
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
    category_slug: string;
  } | null;
}

// =====================================================
// ORDER ITEM
// =====================================================

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;

  food_item_name?: string;

  unit_price: number;
  quantity: number;
  item_total: number;

  food_item?: OrderFoodItem | null | any;
}

// =====================================================
// ORDER
// =====================================================

export interface UserOrder {
  id: string;

  user_id: string;
  restaurant_id: string;

  order_number: string;

  status: string;
  payment_status: string;

  delivery_method: "self_pickup" | "ship";
  payment_method: "cod" | "online";

  // Shipping address snapshot
  first_name?: string | null;
  last_name?: string | null;
  address?: string | null;
  apartment?: string | null;
  city?: string | null;
  postcode?: string | null;
  phone?: string | null;
  country?: string | null;

  // Amounts
  subtotal: number;
  delivery_fee: number;
  total: number;

  created_at?: string;
  updated_at?: string;

  restaurant?: OrderRestaurant | null;

  items?: OrderItem[];
}

// =====================================================
// USER ORDER LIST RESPONSE
// =====================================================

export interface UserOrderListsResponse {
  data: UserOrder[];
  pagination: OrderPagination;
}

// =====================================================
// USER ORDER LIST PARAMS
// =====================================================

export interface UserOrderListsParams {
  search?: string;
  per_page?: number;
  page?: number;
}

// =====================================================
// USER ORDER LIST
// =====================================================

export const UserOrderLists = (
  params?: UserOrderListsParams
): Promise<ApiResponse<UserOrderListsResponse>> => {
  return get<ApiResponse<UserOrderListsResponse>>(
    "/api/web/user/orders",
    params
  );
};