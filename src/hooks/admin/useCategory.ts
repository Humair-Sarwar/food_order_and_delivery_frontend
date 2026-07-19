import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryCreate, CategoryDelete, CategoryGet, CategoryPanel, CategoryUpdate, type CategoryPayload } from "../../services/admin/categoriesService";



export const useCategoryFetch = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryGet(),
  });
};


export const useCategoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CategoryDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};


export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CategoryCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};



export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CategoryPayload;
    }) => CategoryUpdate(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};



export const useCategoryPanel = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["categories-panel"],
    queryFn: CategoryPanel,
    enabled: options?.enabled,
  });
};