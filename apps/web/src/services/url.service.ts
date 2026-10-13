import { authApi, publicApi } from "@/lib/axios";

export type CreateUrlPayload = {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  expiresAt?: string;
  password?: string;
};

export type EditUrlPayload = {
  originalUrl?: string;
  expiresAt?: string;
  title?: string;
};

export const getUrls = async () => {
  const res = await authApi.get("/urls");
  return res.data;
};

export const createUrl = async (payload: CreateUrlPayload) => {
  const res = await authApi.post("/urls", payload);
  return res.data;
};

export const createGuestUrl = async (payload: { originalUrl: string }) => {
  const res = await publicApi.post("/urls/guest", payload);
  return res.data;
};

export const editUrl = async (id: string, payload: EditUrlPayload) => {
  const res = await authApi.patch(`/urls/${id}`, payload);
  return res.data;
};

export const deleteUrl = async (id: string) => {
  const res = await authApi.delete(`/urls/${id}`);
  return res.data;
};
