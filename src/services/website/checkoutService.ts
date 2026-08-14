import { get } from "../apiMethods";

export interface CheckoutUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface CheckoutItem {
  id: string;
  quantity: number;
  unit_price: number;
  item_total: number;
  food_item: any;
}

export interface CheckoutSummary {
  subtotal: number;
  delivery_fee: number;
  total: number;
}

export interface CheckoutCart {
  id: string;
  user_id: string;
  items: CheckoutItem[];
  summary: CheckoutSummary;
}

export interface CheckoutResponse {
  status: boolean;
  message: string;
  data: {
    user: CheckoutUser;
    cart: CheckoutCart;
  };
}

export const getCheckoutData = (
  cartId: string
): Promise<CheckoutResponse> => {
  return get<CheckoutResponse>(
    `/api/web/user/checkout?cart_id=${cartId}`
  );
};