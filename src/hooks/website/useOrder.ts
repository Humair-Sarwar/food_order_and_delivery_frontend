import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getOrderDetails,
  placeOrder,
  UserOrderLists,
  type PlaceOrderPayload,
  type UserOrderListsParams,
} from "../../services/website/orderService";

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (
      data: PlaceOrderPayload
    ) => placeOrder(data),
  });
};



export const useOrderDetails = (
  orderId?: string
) => {
  return useQuery({
    queryKey: ["order-details", orderId],

    queryFn: () => getOrderDetails(orderId!),

    enabled: !!orderId,
  });
};



export const useUserOrderLists = (
  params?: UserOrderListsParams
) => {
  return useQuery({
    queryKey: [
      "user-order-lists",
      params,
    ],

    queryFn: () =>
      UserOrderLists(params),

    staleTime: 1000 * 60,
  });
};