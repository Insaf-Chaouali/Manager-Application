import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const TOKEN_KEY = "token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
