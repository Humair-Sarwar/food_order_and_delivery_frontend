import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAdminSettings, SettingsUpdate, type UpdateSettingsPayload } from "../../services/admin/settingsService";

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: fetchAdminSettings,
    staleTime: 1000 * 60 * 5,
  });
};


export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsPayload) => SettingsUpdate(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-settings"],
      });
    },
  });
};