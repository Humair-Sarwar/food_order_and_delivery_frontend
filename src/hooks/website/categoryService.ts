import { useQuery } from "@tanstack/react-query";
import { WebCategories, WebListingCategories } from "../../services/website/categoryService";


export const useWebCategories = () => {
  return useQuery({
    queryKey: ["web-categories"],
    queryFn: WebCategories,
  });
};

export const useWebListingCategories = (slug?: string) => {
  return useQuery({
    queryKey: ["web-categories-listing", slug],
    queryFn: () => WebListingCategories(slug),
  });
};