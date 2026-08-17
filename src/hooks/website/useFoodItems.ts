import { useQuery } from "@tanstack/react-query";
import {
  FoodItemDetailPage,
  LatestFoodItems,
  RelatedProducts,
  SearchFoodItems,
  WebFoodItems,
  WebsiteSettingsGet,
  type FoodItemDetailParams,
  type RelatedProductsParams,
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




export const useWebsiteSettings = () => {
  return useQuery({
    queryKey: ["website-settings"],
    queryFn: WebsiteSettingsGet,
  });
};









export const useRelatedProducts = (
  params?: RelatedProductsParams
) => {
  return useQuery({
    queryKey: ["related-products", params],
    queryFn: () => RelatedProducts(params),
    enabled: !!params?.food_item_id,
  });
};


export const useLatestFoodItems = () => {
  return useQuery({
    queryKey: ["latest-food-items"],
    queryFn: LatestFoodItems,
  });
};