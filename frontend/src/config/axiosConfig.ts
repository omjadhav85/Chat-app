import { USER_DATA } from "@/lib/constants";
import { forceLogout } from "@/lib/session";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Login and signup don't need a token, and their 401s mean wrong credentials
const isAuthRoute = (url?: string) => !!url?.includes("/api/auth/");

axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (!isAuthRoute(config.url)) {
    const userData = JSON.parse(localStorage.getItem(USER_DATA) || "{}");

    const token = userData.token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 on any other route means the token expired or is invalid, so log out
axiosClient.interceptors.response.use(undefined, function (error) {
  if (error.response?.status === 401 && !isAuthRoute(error.config?.url)) {
    forceLogout();
  }
  return Promise.reject(error);
});

export default axiosClient;
