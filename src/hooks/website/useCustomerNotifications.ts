import { useQuery } from "@tanstack/react-query";
import { fetchCustomerNotifications } from "../../services/website/customerNotifications";

export const useCustomerNotifications = () => {
  return useQuery({
    queryKey: ["customer-notifications"],
    queryFn: fetchCustomerNotifications,

    staleTime: 1000 * 30,

    refetchInterval: 1000 * 30,
  });
};