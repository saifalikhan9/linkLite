import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  isInitializing: boolean;
  setAccessToken: (token: string) => void;
  setInitializing: (value: boolean) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitializing: true,

  setAccessToken: (token) => {
    set({ accessToken: token });
  },
  setInitializing: (val) => {
    set({ isInitializing: val });
  },
  clearAccessToken: () => {
    set({ accessToken: null });
  },
}));
