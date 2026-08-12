import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface Category {
  id: string;
  title: string;
  category_slug: string;
  sort_order: number;
  image_id: string | null;
  cover_image_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  page_description: string | null;
  level: number;
  parent_category_id: string | null;
  listing_design: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  cover_media?: {
    id: string;
    media_path: string;
  } | null;
  media?: {
    id: string;
    media_path: string;
  } | null;
}

export interface ListingCategoryResponse {
  data: Category[];
  selected_category?: Category | null;
}

export const WebCategories = (): Promise<ApiResponse<Category[]>> => {
  return get<ApiResponse<Category[]>>("/api/web/categories");
};

export const WebListingCategories = (
  slug?: string
): Promise<ApiResponse<ListingCategoryResponse>> => {
  return get<ApiResponse<ListingCategoryResponse>>(
    "/api/web/categories/listing",
    slug ? { url: slug } : {}
  );
};


export const WebFilterCategories = (): Promise<
  ApiResponse<Category[]>
> => {
  return get<ApiResponse<Category[]>>(
    "/api/web/categories/filter"
  );
};