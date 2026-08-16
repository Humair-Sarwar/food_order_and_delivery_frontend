import { get } from "../apiMethods";

export interface CustomerNotification {
  id: string | number;
  type: string;
  title: string;
  description: string;
  order_id: string | number;
  order_number: string;
  status: string;
  restaurant: string;
  time: string | null;
  created_at: string | null;
}

export interface CustomerNotificationsResponse {
  status: boolean;
  message: string;
  unread_count: number;
  data: CustomerNotification[];
}

export const fetchCustomerNotifications = () => {
  return get<CustomerNotificationsResponse>(
    "/api/web/user/notifications"
  );
};