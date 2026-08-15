import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../../services/admin/dashboardService";

export const useDashboard = () => {

  return useQuery({
    queryKey: [
      "admin-dashboard",
    ],

    queryFn: getDashboard,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });
};