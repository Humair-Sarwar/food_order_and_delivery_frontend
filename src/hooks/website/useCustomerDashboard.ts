import { useQuery } from "@tanstack/react-query";
import { getCustomerDashboard } from "../../services/website/customerDashboard";


export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: getCustomerDashboard,
  });
};