"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect } from "react";
import { api } from "~/lib/api";
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
  const router = useRouter();

  const signOut = () => {
    router.push("/auth/sign-out");
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refreshToken = useCallback(async () => {
    try {
      await api.post("/auth/refresh-token");
    } catch (err) {
      router.push("/auth/sign-out");
    }
  }, [router]);

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
