import { get } from "../apiMethods";


export interface AdminNotification {
  id: string | number;
  type: string;
  title: string;
  description: string;
  order_id: string | number;
  order_number: string;
  status: string;
  restaurant: string;
  customer: string;
  time: string | null;
  created_at: string | null;
}

export interface AdminNotificationsResponse {
  status: boolean;
  message: string;
  unread_count: number;
  data: AdminNotification[];
}

export interface NotificationsFetchProps {
  limit?: number;
}

export const fetchAdminNotifications = (
  params?: NotificationsFetchProps
) => {
  return get<AdminNotificationsResponse>(
    "/api/admin/notifications",
    params
  );
};