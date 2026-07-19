import { del, get, post, put } from "../apiMethods";
import type { ApiResponse } from "../../api/client";
import type { FoodItem } from "../../pages/admin/food-items/FoodItems";

export interface Restaurant {
  id: string;
  name: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface FoodItemListApiResponse {
  status: boolean;
  message: string;
  data: FoodItem[];
  restaurants: Restaurant[];
  pagination: Pagination;
}

export interface FoodItemsFetchProps {
  page: number;
  per_page: number;
  search_by_title?: string;
  search_item_available?: string;
  search_product_status?: string;
  search_by_category?: string;
  search_by_restaurant?: string;
}

export interface FoodItemStatusPayload {
  is_published: boolean;
}

export const FoodItemGet = (params: FoodItemsFetchProps) => {
  return get<FoodItemListApiResponse>("/api/admin/food-items", params);
};


export const FoodItemDelete = (
  id: string
): Promise<ApiResponse> => {
  return del<ApiResponse>(`/api/admin/food-item/delete/${id}`);
};





export const FoodItemUpdateStatus = (
  id: string,
  data: FoodItemStatusPayload
): Promise<ApiResponse> => {
  return put<ApiResponse>(`/api/admin/food-item/status/${id}`, data);
};



export interface FoodItemPayload {
  title: string;
  category_id: string;
  restaurant_id: string;
  sort_order: number;
  regular_price: number;
  sale_price?: number | null;
  is_on_sale: boolean;
  description: string;
  is_available: boolean;
  is_published: boolean;
  image_id?: string | number | null;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
}

export const FoodItemCreate = (
  data: FoodItemPayload
): Promise<ApiResponse> => {
  return post<ApiResponse>("/api/admin/food-item/create", data);
};



export const FoodItemEdit = (
  id: string
): Promise<ApiResponse> => {
  return get<ApiResponse>("/api/admin/food-item/edit", {
    id,
  });
};

export const FoodItemUpdate = (
  id: string,
  data: FoodItemPayload
): Promise<ApiResponse> => {
  return put<ApiResponse>(`/api/admin/food-item/update/${id}`, data);
};



