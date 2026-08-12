import { useQuery } from "@tanstack/react-query";
import {
  FoodItemDetailPage,
  SearchFoodItems,
  WebFoodItems,
  type FoodItemDetailParams,
  type SearchFoodItemsParams,
  type WebFoodItemsParams,
} from "../../services/website/foodItemService";

export const useWebFoodItems = (
  params?: WebFoodItemsParams
) => {
  return useQuery({
    queryKey: ["web-food-items", params],
    queryFn: () => WebFoodItems(params),
  });
};

export const useFoodItemDetail = (
  params?: FoodItemDetailParams
) => {
  return useQuery({
    queryKey: ["web-food-item-detail", params],

    queryFn: () => FoodItemDetailPage(params),

    enabled: !!params?.id,
  });
};


export const useSearchFoodItems = (
  params?: SearchFoodItemsParams
) => {
  return useQuery({
    queryKey: ["search-food-items", params?.search],

    queryFn: () => SearchFoodItems(params),

    enabled: !!params?.search?.trim(),
  });
};