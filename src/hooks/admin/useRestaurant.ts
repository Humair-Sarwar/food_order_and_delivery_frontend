import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RestaurantCreate, RestaurantDelete, RestaurantGet, RestaurantUpdate, updateRestaurantStatus, type RestaurantPayload } from "../../services/admin/restaurantService";


interface RestaurantFetchProps {
  page: number;
  per_page: number;
  search?: string;
  status?: string;
}

export const useRestaurantFetch = ({
  page,
  per_page,
  search,
  status,
}: RestaurantFetchProps) => {
  return useQuery({
    queryKey: [
      "restaurants",
      page,
      per_page,
      search,
      status,
    ],
    queryFn: () =>
      RestaurantGet({
        page,
        per_page,
        search,
        status,
      }),
  });
};



export const useRestaurantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => updateRestaurantStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
  });
};



export const useRestaurantDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RestaurantDelete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
  });
};



export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RestaurantCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
  });
};




export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: RestaurantPayload;
    }) => RestaurantUpdate(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurants"],
      });
    },
  });
};