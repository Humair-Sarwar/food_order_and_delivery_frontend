import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FoodItemCreate, FoodItemDelete, FoodItemEdit, FoodItemGet, FoodItemUpdate, FoodItemUpdateStatus, type FoodItemPayload, type FoodItemStatusPayload } from "../../services/admin/foodItemService";


interface FoodItemsFetchProps {
  page: number;
  per_page: number;
  search_by_title?: string;
  search_item_available?: string;
  search_product_status?: string;
  search_by_category?: string;
  search_by_restaurant?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
}

export const useFoodItems = ({
  page,
  per_page,
  search_by_title,
  search_item_available,
  search_product_status,
  search_by_category,
  search_by_restaurant,
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




export const useFoodItemCreate = () => {
  return useMutation({
    mutationFn: (data: FoodItemPayload) => FoodItemCreate(data),
  });
};



interface UseFoodItemEditProps {
  id: string;
  enabled?: boolean;
}

export const useFoodItemEdit = ({
  id,
  enabled = true,
}: UseFoodItemEditProps) => {
  return useQuery({
    queryKey: ["food-item-edit", id],
    queryFn: () => FoodItemEdit(id),
    enabled: enabled && !!id,

    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};

export const useFoodItemUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FoodItemPayload }) => FoodItemUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-items"],
      });
    },
  });
};