import { get, put } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface ProfileInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  dob?: any;
  image?: {
    id: string;
    media_path: string;
  } | null;
}

export const ProfileInfoGet = (): Promise<ApiResponse<ProfileInfo>> => {
  return get<ApiResponse<ProfileInfo>>(
    "/api/web/user/profile-info"
  );
};


export interface ProfileUpdatePayload {
  first_name: string;
  last_name: string;
  email: string;
  dob?: string | null;
  phone?: string | null;
}

export const ProfileInfoUpdate = (
  data: ProfileUpdatePayload
): Promise<ApiResponse<ProfileInfo>> => {
  return put<ApiResponse<ProfileInfo>>(
    "/api/web/user/profile-info/update",
    data
  );
};



export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const ChangePassword = (
  data: ChangePasswordPayload
): Promise<ApiResponse> => {
  return put<ApiResponse>(
    "/api/web/user/change-password",
    data
  );
};


import { post } from "../apiMethods";

export const ProfileImageUpdate = (
  image: File
): Promise<ApiResponse<{ image: string }>> => {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("_method", "PUT");

  return post<ApiResponse<{ image: string }>>(
    "/api/web/user/profile-image/update",
    formData
  );
};