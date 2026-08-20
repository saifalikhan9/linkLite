import { publicApi } from "@/lib/axios";
import type { SignupPayload, LoginPayload, AuthResponse } from "@/types/auth";

export const signup = async (data: SignupPayload): Promise<AuthResponse> => {
  const res = await publicApi.post<AuthResponse>("/auth/register", data);

  return res.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await publicApi.post<AuthResponse>("/auth/login", data);

  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await publicApi.post("/auth/refreshToken", {});
  return res.data;
};

export const logout = async () => {
  const res = await publicApi.post("/auth/logout", {});
  return res.data;
};
