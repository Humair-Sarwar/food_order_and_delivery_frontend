import { useQuery } from "@tanstack/react-query";
import { CustomerGet } from "../../services/admin/customerService";



interface CustomerFetchProps {
  page: number;
  per_page: number;
  search?: string;
}

export const useCustomerFetch = ({
  page,
  per_page,
  search,
}: CustomerFetchProps) => {
  return useQuery({
    queryKey: [
      "customers",
      page,
      per_page,
      search,
    ],
    queryFn: () =>
      CustomerGet({
        page,
        per_page,
        search,
      }),
  });
};