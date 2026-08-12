import { useQuery } from "@tanstack/react-query";
import {
    AllRestaurantsListing,
  WebRestaurantsListing,
} from "../../services/website/restaurantService";

export const useWebRestaurants = () => {
  return useQuery({
    queryKey: ["web-restaurants"],
    queryFn: WebRestaurantsListing,
  });
};

export const useAllRestaurantsListing = () => {
  return useQuery({
    queryKey: ["web-restaurants-listing"],
    queryFn: AllRestaurantsListing,
  });
};