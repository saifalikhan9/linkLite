"use client";

import { useEffect } from "react";
import { refreshAccessToken } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const setAccessToken = useAuthStore(
        (state) => state.setAccessToken,
      );
      
      const setInitializing = useAuthStore(
        (state) => state.setInitializing,
      );
      useEffect(() => {
        const restoreSession = async () => {
          try {
            const data = await refreshAccessToken();
      
            if (data.success) {
              setAccessToken(data.data.accessToken);
            }
          } catch {
            // No valid refresh token.
          } finally {
            setInitializing(false);
          }
        };
      
        restoreSession();
      }, [setAccessToken, setInitializing]);
  return children;
}