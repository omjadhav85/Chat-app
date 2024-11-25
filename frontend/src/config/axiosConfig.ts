import { USER_DATA } from "@/lib/constants";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (
    !config.url?.includes("/api/users/login") &&
    !config.url?.includes("/api/users/signup")
  ) {
    const userData = JSON.parse(localStorage.getItem(USER_DATA) || "{}");

    const token = userData.token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
