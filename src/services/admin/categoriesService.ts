import { del, get, post, put } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface CategoryPayload {
  title: string;
  category_slug: string;
  sort_order: number;
  image_id?: string;
  cover_image_id?: string;
  meta_title?: string;
  meta_description?: string;
  page_description?: string;
  parent_category_id?: string;
  level?: number;
}

export const CategoryGet = () => {
  return get<ApiResponse>("/api/admin/categories");
};

export const CategoryDelete = (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/api/admin/category/${id}`);
};

export const CategoryCreate = (
  data: CategoryPayload
): Promise<ApiResponse> => {
  return post<ApiResponse>("/api/admin/category", data);
};


export const CategoryUpdate = (
  id: string,
  data: CategoryPayload
): Promise<ApiResponse> => {
  return put<ApiResponse>(`/api/admin/category/${id}`, data);
};


export const CategoryPanel = () => {
  return get<ApiResponse>("/api/admin/categories/panel");
};