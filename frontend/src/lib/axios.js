import axios from "axios";
import { API_URL } from "@/config";
import { removeToken } from "@/utils/auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      if (url.includes("/auth/login") || url.includes("/auth/register")) {
        return Promise.reject(error);
      }

      if (!isRedirecting) {
        isRedirecting = true;
        removeToken();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
