import type { ApiResponse } from "../../api/client";
import { del, get, post, put } from "../apiMethods";

export interface Address {
  id: string;
  user_id: string | null;
  country: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment: string | null;
  city: string;
  postcode: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

// ==================== GET ADDRESSES ====================

export interface AddressesResponse {
  status: boolean;
  message: string;
  data: Address[];
}

export const getAddresses = (): Promise<AddressesResponse> => {
  return get<AddressesResponse>("/api/web/user/addresses");
};

// ==================== CREATE ADDRESS ====================

export interface CreateAddressPayload {
  country: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  phone: string;
}

export interface CreateAddressResponse {
  status: boolean;
  message: string;
  data: Address;
}

export const createAddress = (
  data: CreateAddressPayload
): Promise<CreateAddressResponse> => {
  return post<CreateAddressResponse>(
    "/api/web/user/addresses",
    data
  );
};

// ==================== UPDATE ADDRESS ====================

export interface UpdateAddressPayload {
  id: string;
  country: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment?: string | null;
  city: string;
  postcode: string;
  phone: string;
}

export const updateAddress = ({
  id,
  ...data
}: UpdateAddressPayload): Promise<ApiResponse<Address>> => {
  return put<ApiResponse<Address>>(
    `/api/web/user/addresses/${id}`,
    data
  );
};



export const deleteAddress = (
  id: string
): Promise<ApiResponse<null>> => {
  return del<ApiResponse<null>>(
    `/api/web/user/addresses/${id}`
  );
};