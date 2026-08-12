import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: {
    id: string;
    media_path: string;
  } | null;
}

export const WebCategories = (): Promise<ApiResponse<Category[]>> => {
  return get<ApiResponse<Category[]>>("/api/web/categories");
};

export const WebListingCategories = (
  slug?: string
): Promise<ApiResponse<Category[]>> => {
  return get<ApiResponse<Category[]>>(
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