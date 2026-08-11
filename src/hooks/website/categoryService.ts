import { useQuery } from "@tanstack/react-query";
import { WebCategories } from "../../services/website/categoryService";


export const useWebCategories = () => {
  return useQuery({
    queryKey: ["web-categories"],
    queryFn: WebCategories,
  });
};