import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToWishlist, RemoveFromWishlist, WishlistGet, type WishlistParams } from "../../services/website/wishlistService";

export const useWishlist = (params?: WishlistParams) => {
  return useQuery({
    queryKey: ["wishlist", params],
    queryFn: () => WishlistGet(params),
  });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RemoveFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });
};


export const useAddToWishlist = () => {
  return useMutation({
    mutationFn: AddToWishlist,
  });
};