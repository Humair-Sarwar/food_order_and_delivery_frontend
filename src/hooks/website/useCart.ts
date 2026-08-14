import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToCart, GetCart, RemoveFromCart, UpdateCartQuantity } from "../../services/website/cartService";





export const useCart = (cartId?: string | null) => {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => GetCart({ cart_id: cartId! }),
    enabled: !!cartId,
  });
};


export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddToCart,

    onSuccess: async (response) => {
      const newCartId = response?.data?.cart_id;

      if (newCartId) {
        localStorage.setItem("cart_id", newCartId);

        // Tell Header that cart ID has changed
        window.dispatchEvent(new Event("cartUpdated"));
      }

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false,
      });
    },
  });
};



export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RemoveFromCart,

    onSuccess: async (response) => {
      const cartDeleted = response?.data?.cart_deleted;

      // Only remove cart_id when the entire cart has been deleted
      if (cartDeleted) {
        localStorage.removeItem("cart_id");
      }

      // Tell Header that cart data has changed
      window.dispatchEvent(new Event("cartUpdated"));

      // Refresh cart data
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false,
      });
    },
  });
};


export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateCartQuantity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};