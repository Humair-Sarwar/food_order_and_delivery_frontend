import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChangePassword,
  ProfileImageUpdate,
  ProfileInfoGet,
  ProfileInfoUpdate,
  type ChangePasswordPayload,
  type ProfileUpdatePayload,
} from "../../services/website/profileService";

export const useProfileInfo = () => {
  return useQuery({
    queryKey: ["profile-info"],
    queryFn: ProfileInfoGet,
  });
};


export const useProfileInfoUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdatePayload) =>
      ProfileInfoUpdate(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-info"],
      });
    },
  });
};



export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      ChangePassword(data),
  });
};



export const useProfileImageUpdate = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProfileImageUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-info"],
      });
    },
  });
};