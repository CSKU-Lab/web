import { headers } from "next/headers";
import { isFromMobile } from "~/lib/isFromMobile";

/**
 * Server-only helper: detect whether the current request comes from a mobile
 * device based on the User-Agent header. Wraps `isFromMobile` so call sites
 * don't have to pull the header themselves.
 */
export const getIsMobile = async (): Promise<boolean> => {
  const userAgent = (await headers()).get("User-Agent");
  if (userAgent === null) return false;
  return isFromMobile(userAgent);
};
