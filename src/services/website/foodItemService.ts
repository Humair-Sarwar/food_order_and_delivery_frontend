import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

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

export interface WebFoodItemsParams {
  url?: string;
  search_by_title?: string;
  per_page?: number;
}

export const WebFoodItems = (
  params?: WebFoodItemsParams
): Promise<ApiResponse<WebFoodItem[]>> => {
  return get<ApiResponse<WebFoodItem[]>>(
    "/api/web/food-items",
    params
  );
};