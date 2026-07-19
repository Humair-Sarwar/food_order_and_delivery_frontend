import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface CustomerParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const CustomerGet = (
  params: CustomerParams
): Promise<ApiResponse> => {
  return get<ApiResponse>("/api/admin/customers", 
    params);
};