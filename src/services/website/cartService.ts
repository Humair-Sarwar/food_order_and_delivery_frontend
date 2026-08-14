
import type { ApiResponse } from "../../api/client";
import { del, get, post, put } from "../apiMethods";

export interface AddToCartPayload {
  food_item_id: string;
  quantity: number;
  cart_id?: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  food_item_id: string;
  quantity: number;
  item_total: number;

  food_item: {
    id: string;
    title: string;
    slug: string;
    regular_price: number;
    sale_price: number | null;
    is_on_sale: number;
    is_available: number;
    is_published: number;
    description: string | null;

    image?: {
      id: string;
      media_path: string;
    } | null;

    category?: {
      id: string;
      title: string;
      category_slug?: string;
    } | null;

    restaurant?: {
      id: string;
      name: string;
    } | null;
  };
}

export interface AddToCartResponse {
  cart_id: string;
  cart_item: CartItem;
}

export const AddToCart = (
  data: AddToCartPayload
): Promise<ApiResponse<AddToCartResponse>> => {
  return post<ApiResponse<AddToCartResponse>>(
    "/api/web/cart/add",
    data
  );
};




export interface CartSummary {
  subtotal: number;
  delivery_fee: number;
  total: number;
}

export interface Cart {
  id: string;
  user_id: string | null;
  items: CartItem[];
  summary: CartSummary;
}

export interface GetCartParams {
  cart_id: string;
}

export const GetCart = (
  params: GetCartParams
): Promise<ApiResponse<Cart>> => {
  return get<ApiResponse<Cart>>(
    "/api/web/cart",
    params
  );
};



export interface RemoveCartItemPayload {
  cart_item_id: string;
}

export interface RemoveCartItemResponse {
  cart_deleted: boolean;
  cart_id: string;
}

export const RemoveFromCart = (
  data: RemoveCartItemPayload
): Promise<ApiResponse<RemoveCartItemResponse>> => {
  return del<ApiResponse<RemoveCartItemResponse>>(
    "/api/web/cart/remove",
    data
  );
};



export interface UpdateCartQuantityPayload {
  cart_item_id: string;
  quantity: number;
}

export const UpdateCartQuantity = (
  data: UpdateCartQuantityPayload
): Promise<ApiResponse<CartItem>> => {
  return put<ApiResponse<CartItem>>(
    "/api/web/cart/update-quantity",
    data
  );
};