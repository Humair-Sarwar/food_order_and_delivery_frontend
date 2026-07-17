import type { ApiResponse } from "../../api/client";
import { del, get, post } from "../apiMethods";

interface MediaParams {
  page: number;
  per_page: number;
}

export const MediaGet = async (
  params: MediaParams
): Promise<ApiResponse> => {
  return get<ApiResponse>("/api/admin/medias", params);
};


// ================= DELETE =================

export const deleteMedia = (
  id: string
): Promise<ApiResponse> => {
  return del<ApiResponse>(`/api/admin/media/delete/${id}`);
};



export const uploadMedia = (
  data: FormData, 
  onProgress?: (progress: number) => void
): Promise<ApiResponse> => {
  return post<ApiResponse>(
    "/api/admin/medias/uploads",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );
};



export const addNewMedia = (data: FormData): Promise<ApiResponse> => {
  return post<ApiResponse>(
    "/api/admin/media",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};