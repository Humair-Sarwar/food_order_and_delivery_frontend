import { useQuery } from "@tanstack/react-query";
import { getCheckoutData } from "../../services/website/checkoutService";

export const useCheckout = (cartId?: string) => {
  return useQuery({
    queryKey: ["checkout", cartId],
    queryFn: () => getCheckoutData(cartId!),
    enabled: !!cartId,
  });
};