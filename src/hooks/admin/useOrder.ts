import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminOrderDetails, AdminOrderLists, AdminOrderStatusUpdate, OrderExportCsv, type AdminOrderDetailsParams, type AdminOrderListsParams, type AdminOrderStatusUpdateParams, type OrdersFetchProps } from "../../services/admin/orderService";
import { useEffect } from "react";



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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-order-details", params.order_id],

    queryFn: () => AdminOrderDetails(params),

    enabled: !!params.order_id,

    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });
    }
  }, [
    query.isSuccess,
    queryClient,
  ]);

  return query;
};




export const useAdminOrderStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AdminOrderStatusUpdateParams) =>
      AdminOrderStatusUpdate(params),

    onSuccess: (_, variables) => {
      // Refresh order details
      queryClient.invalidateQueries({
        queryKey: ["admin-order-details", variables.order_id],
      });

      // Refresh admin order list
      queryClient.invalidateQueries({
        queryKey: ["admin-order-lists"],
      });
    },
  });
};



export const useOrderExportCsv = () => {
  return useMutation({
    mutationFn: (params: OrdersFetchProps) =>
      OrderExportCsv(params),

    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `orders-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    },
  });
};