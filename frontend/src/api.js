import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 120000,  
});

export function getErrorMessage(error, fallback) {
  return error?.response?.data?.detail || fallback;
}