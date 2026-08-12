import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  pagination?: T
}

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    Accept: "application/json",
  },

  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Auto logout on unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;