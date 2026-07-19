import { del, get, post, put } from "../apiMethods";
import type { ApiResponse } from "../../api/client";



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
  return get<ApiResponse>("/api/admin/food-items", params);
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