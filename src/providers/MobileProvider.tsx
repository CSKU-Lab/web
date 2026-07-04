"use client";

import { createContext, useContext } from "react";
import type { ChildrenProps } from "~/types/children-props";

const mobileContext = createContext<boolean>(false);

/**
 * Exposes the server-detected mobile flag to client components so they don't
 * re-run UA detection (which would risk hydration mismatch). The value is
 * resolved once on the server via `getIsMobile` and passed down here.
 */
export const useIsMobile = () => useContext(mobileContext);

interface Props extends ChildrenProps {
  isMobile: boolean;
}

export default function MobileProvider({ isMobile, children }: Props) {
  return (
    <mobileContext.Provider value={isMobile}>{children}</mobileContext.Provider>
  );
}
