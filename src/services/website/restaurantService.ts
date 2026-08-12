import { get } from "../apiMethods";
import type { ApiResponse } from "../../api/client";

export interface Restaurant {
  id: string;
  name: string;
  // add other fields your API returns
}

export const WebRestaurantsListing = (): Promise<
  ApiResponse<Restaurant[]>
> => {
  return get<ApiResponse<Restaurant[]>>(
    "/api/web/restaurants/listing"
  );
};


export const AllRestaurantsListing = (): Promise<
  ApiResponse<Restaurant[]>
> => {
  return get<ApiResponse<Restaurant[]>>(
    "/api/web/restaurants/listing/data"
  );
};