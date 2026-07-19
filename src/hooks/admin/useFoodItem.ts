import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FoodItemDelete, FoodItemGet, FoodItemUpdateStatus, type FoodItemStatusPayload } from "../../services/admin/foodItemService";


interface FoodItemsFetchProps {
  page: number;
  per_page: number;
  search_by_title?: string;
  search_item_available?: string;
  search_product_status?: string;
  search_by_category?: string;
  search_by_restaurant?: string;
}

export const useFoodItems = ({
  page,
  per_page,
  search_by_title,
  search_item_available,
  search_product_status,
  search_by_category,
  search_by_restaurant
}: FoodItemsFetchProps) => {
  return useQuery({
    queryKey: [
      "food-items",
      page,
      per_page,
      search_by_title,
      search_item_available,
      search_product_status,
      search_by_category,
      search_by_restaurant
    ],
    queryFn: () =>
      FoodItemGet({
        page,
        per_page,
        search_by_title,
        search_item_available,
        search_product_status,
        search_by_category,
        search_by_restaurant
      }),
  });
};


export const useFoodItemDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FoodItemDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-items"],
      });
    },
  });
};



export const useFoodItemStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FoodItemStatusPayload;
    }) => FoodItemUpdateStatus(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-items"],
      });
    },
  });
};