import api from "../api/client";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// Generic response wrapper
export const post = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res: AxiosResponse<T> = await api.post(url, data, config);
  return res.data;
};

export const get = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  const res = await api.get<T>(url, {
    params,
  });

  return res.data;
};

export const put = async <T>(
  url: string,
  data: any
): Promise<T> => {
  const res: AxiosResponse<T> = await api.put(url, data);
  return res.data;
};

export const del = async <T>(
  url: string,
  data?: any
): Promise<T> => {
  const res: AxiosResponse<T> = await api.delete(url, {
    data,
  });

  return res.data;
};