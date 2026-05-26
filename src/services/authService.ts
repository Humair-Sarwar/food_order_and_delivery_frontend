
import type { ApiResponse } from "../api/client";
import { post } from "./apiMethods";

export const registerUser = async (
  data: any
): Promise<ApiResponse> => {
  return post<ApiResponse>("/auth/register", data);
};

export const loginUser = async (
  data: any
): Promise<ApiResponse> => {
  return post<ApiResponse>("/auth/login", data);
};