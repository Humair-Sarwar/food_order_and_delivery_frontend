import { useQuery } from "@tanstack/react-query";
import {
  WebFoodItems,
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