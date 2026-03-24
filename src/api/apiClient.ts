import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config/api.config";
import { encryptPayload } from "../utils/encryption";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _encrypted?: boolean;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

apiClient.interceptors.request.use(async (config: CustomAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Prevent double encryption
  if (config.data && !config._encrypted) {
    const encrypted = await encryptPayload(config.data);

    config.data = { data: encrypted };
    config._encrypted = true; // mark as encrypted
  }

  return config;
});

/* =========================
   REFRESH TOKEN LOGIC
========================= */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // ❌ If refresh API itself fails → logout
    if (originalRequest?.url?.includes("/auth/refresh")) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const encryptedRefreshPayload = await encryptPayload({ refreshToken });

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { data: encryptedRefreshPayload },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data?.token;

        if (!newAccessToken) {
          throw new Error("Invalid refresh response");
        }

        localStorage.setItem("token", newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;