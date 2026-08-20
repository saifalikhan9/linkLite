import axios from "axios";
import { useAuthStore } from "@/store/auth.store";


export const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });
  
  export const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });


  authApi.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });