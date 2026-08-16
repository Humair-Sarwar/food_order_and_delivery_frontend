import api, { type ApiResponse } from "../../api/client";
import { get, post } from "../apiMethods";

export interface AdminSettings {
  id: number;

  site_name: string | null;
  email: string | null;
  phone: string | null;

  whatsapp_number: string | null;
  whatsapp_enabled: boolean;

  footer_description: string | null;

  logo_id: string | null;

  logo: {
    id: string;
    [key: string]: unknown;
  } | null;

  cod_enabled: boolean;
  digital_payment_enabled: boolean;

  created_at: string;
  updated_at: string;
}

export interface AdminSettingsResponse {
  status: boolean;
  message: string;
  data: AdminSettings;
}

export const fetchAdminSettings = () => {
  return get<AdminSettingsResponse>(
    "/api/admin/settings"
  );
};



export interface UpdateSettingsPayload {
  site_name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp_number?: string | null;
  whatsapp_enabled: boolean;
  footer_description?: string | null;
  logo_id?: string | null;
  cod_enabled: boolean;
  digital_payment_enabled: boolean;
}

export const SettingsUpdate = (
  data: UpdateSettingsPayload
): Promise<ApiResponse> => {
  return post<ApiResponse>("/api/admin/settings", data);
};