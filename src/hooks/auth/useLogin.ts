import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, Logout } from "../../services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    // Optional: catch global or side-effect errors safely here if needed
    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });
};


export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Logout,

    onSuccess: () => {

      // Clear cached user-related data
      queryClient.clear();
    },
  });
};