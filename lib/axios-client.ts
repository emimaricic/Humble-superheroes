import axios from "axios";
import { TokenManager } from "./token-manager";

let isRefreshing = false;
let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  async (config) => {
    const tokens = await TokenManager.getTokens();

    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status, config: failedRequest } = error.response || {};
    const originalRequest = failedRequest;

    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If we're already refreshing, wait for that to complete
      if (refreshPromise) {
        try {
          await refreshPromise;
          return API(originalRequest);
        } catch (error) {
          window.location.href = "/auth";
          return Promise.reject(error);
        }
      }

      // Start a new refresh
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
          .then(async (response) => {
            if (!response.ok) throw new Error("Refresh failed");
            return response.json();
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

        try {
          await refreshPromise;
          return API(originalRequest);
        } catch (error) {
          // If refresh fails, redirect to auth - session is invalid
          TokenManager.clearTokens();
          window.location.href = "/auth";
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default API;
