import { authApi } from "@/lib/axios";

export const getUrls = async () => {
  const res = await authApi.get("/urls");
  return res.data;
};
