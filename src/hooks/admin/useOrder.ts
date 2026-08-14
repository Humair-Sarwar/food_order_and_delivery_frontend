import { useQuery } from "@tanstack/react-query";
import { AdminOrderDetails, AdminOrderLists, type AdminOrderDetailsParams, type AdminOrderListsParams } from "../../services/admin/orderService";



export const useAdminOrderLists = (
  params?: AdminOrderListsParams
) => {
  return useQuery({
    queryKey: [
      "admin-order-lists",
      params,
    ],

    queryFn: () => AdminOrderLists(params),

    staleTime: 1000 * 60,
  });
};



export const useAdminOrderDetails = (
  params: AdminOrderDetailsParams
) => {
  return useQuery({
    queryKey: ["admin-order-details", params.order_id],

    queryFn: () => AdminOrderDetails(params),

    enabled: !!params.order_id,

    staleTime: 1000 * 60 * 5,
  });
};