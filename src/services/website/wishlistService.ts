import { del, get, post } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface PaginationMeta {
  current_page: number;
  from?: number;
  last_page: number;
  per_page?: number;
  to?: number;
  total: number;
  
}

export interface WishlistItem {
  id: string;
  user_id: string;
  food_item_id: string;

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
      category_slug: string;
    };

    restaurant?: {
      id: string;
      name: string;
    };
  };
}

export interface WishlistResponse {
  data: WishlistItem[];
  pagination: PaginationMeta;
}

export interface WishlistParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export const WishlistGet = (
  params?: WishlistParams
): Promise<ApiResponse<WishlistResponse>> => {
  return get<ApiResponse<WishlistResponse>>(
    "/api/web/user/wishlist",
    params
  );
};



export interface RemoveWishlistPayload {
  food_item_id: string;
}

export const RemoveFromWishlist = (
  data: RemoveWishlistPayload
): Promise<ApiResponse<null>> => {
  return del<ApiResponse<null>>(
    "/api/web/user/wishlist/remove",
    data
  );
};



export interface AddWishlistPayload {
  food_item_id: string;
}

export const AddToWishlist = (
  data: AddWishlistPayload
): Promise<ApiResponse<null>> => {
  return post<ApiResponse<null>>(
    "/api/web/user/wishlist/add",
    data
  );
};