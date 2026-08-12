import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface WebFoodItem {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  restaurant_id: string;
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
}
export interface WebFoodItemsResponse {
  data: WebFoodItem[];
  pagination: PaginationMeta;
}

export interface WebFoodItemsParams {
  url?: string;
  search?: string;
  search_by_title?: string;
  per_page?: number;
  page?: number;
  is_available?: number;
  on_sale?: number;
  min_price?: number;
  max_price?: number;
  restaurant?: string;
  category?: string;
}

export const WebFoodItems = (
  params?: WebFoodItemsParams
): Promise<ApiResponse<WebFoodItemsResponse>> => {
  return get<ApiResponse<WebFoodItemsResponse>>(
    "/api/web/food-items",
    params
  );
};


export interface FoodItemDetailParams {
  id?: string;
}

export type FoodItemDetail = WebFoodItem;

export const FoodItemDetailPage = (
  params?: FoodItemDetailParams
): Promise<ApiResponse<FoodItemDetail>> => {
  return get<ApiResponse<FoodItemDetail>>(
    "/api/web/food-item/detail-page",
    params
  );
};


export interface SearchFoodItemsParams {
  search?: string;
}

export const SearchFoodItems = (
  params?: SearchFoodItemsParams
): Promise<ApiResponse<WebFoodItem[]>> => {
  return get<ApiResponse<WebFoodItem[]>>(
    "/api/web/food-item/search-food-items",
    params
  );
};