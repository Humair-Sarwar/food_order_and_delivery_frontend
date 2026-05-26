import api from "../api/client";
import type { AxiosResponse } from "axios";

// Generic response wrapper
export const post = async <T>(
  url: string,
  data: any
): Promise<T> => {
  const res: AxiosResponse<T> = await api.post(url, data);
  return res.data;
};

export const get = async <T>(url: string): Promise<T> => {
  const res: AxiosResponse<T> = await api.get(url);
  return res.data;
};

export const put = async <T>(
  url: string,
  data: any
): Promise<T> => {
  const res: AxiosResponse<T> = await api.put(url, data);
  return res.data;
};

export const del = async <T>(url: string): Promise<T> => {
  const res: AxiosResponse<T> = await api.delete(url);
  return res.data;
};