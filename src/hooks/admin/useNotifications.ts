import { useQuery } from "@tanstack/react-query";
import { fetchAdminNotifications, type NotificationsFetchProps } from "../../services/admin/notificationService";

export const useAdminNotifications = (
  params?: NotificationsFetchProps
) => {
  return useQuery({
    queryKey: ["admin-notifications", params],

    queryFn: () =>
      fetchAdminNotifications(params),

    refetchInterval: 30000,

    staleTime: 10000,
  });
};