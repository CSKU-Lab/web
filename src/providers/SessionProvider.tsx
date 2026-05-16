"use client";

import { AxiosError } from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { api } from "~/lib/api.client";
import type { ChildrenProps } from "~/types/children-props";
import type { JWTUser } from "~/types/user";

interface SessionContext {
  user: JWTUser;
  signOut: () => void;
}
const sessionContext = createContext<SessionContext | null>(null);

export const useSession = () => {
  const context = useContext(sessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};

interface Props extends ChildrenProps {
  user: JWTUser;
}

function SessionProvider({ user, children }: Props) {
  const signOut = () => {
    fetch("/auth/sign-out", { method: "POST", credentials: "include" }).then(
      () => {
        window.location.href = "/auth/sign-in";
      },
    );
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastRefreshTime = useRef(0);

  const refreshToken = useCallback(async () => {
    const now = Date.now();
    const cooldownMs = 60_000; // 1 minute

    if (now - lastRefreshTime.current < cooldownMs) {
      return;
    }

    lastRefreshTime.current = now;

    try {
      await api.post("/auth/refresh-token");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        signOut();
      }
    }
  }, []);

  useEffect(() => {
    refreshToken();
  }, [pathname, searchParams, refreshToken]);

  return (
    <sessionContext.Provider value={{ user, signOut }}>
      {children}
    </sessionContext.Provider>
  );
}

export default SessionProvider;
