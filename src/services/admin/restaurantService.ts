import type { ApiResponse } from "../../api/client";
import { del, get, post, put } from "../apiMethods";


export interface RestaurantPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  logo_id: string | null;
  banner_id: string | null;
  status?: string;
  slug?: string;
}


export const RestaurantGet = (params: {
  page: number;
  per_page: number;
  search?: string;
  status?: string;
}) => {
  return get<ApiResponse>("/api/admin/restaurants", params);
};


export const updateRestaurantStatus = (
  id: string,
  status: string
): Promise<ApiResponse> => {
  return put<ApiResponse>(`/api/admin/restaurant/status/${id}`, {
    status,
  });
};


export const RestaurantDelete = (id: string): Promise<ApiResponse> => {
  return del<ApiResponse>(`/api/admin/restaurant/${id}`);
};


export const RestaurantCreate = (
  data: RestaurantPayload
): Promise<ApiResponse> => {
  return post<ApiResponse>("/api/admin/create-restaurant", data);
};


export const RestaurantUpdate = (
  id: string,
  data: RestaurantPayload
): Promise<ApiResponse> => {
  return put<ApiResponse>(`/api/admin/restaurants/${id}`, data);
};



export const RestaurantPanel = (): Promise<ApiResponse> => {
  return get<ApiResponse>("/api/admin/restaurants/panel");
};