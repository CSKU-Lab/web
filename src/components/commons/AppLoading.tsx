"use client";
import { AnimatePresence, motion } from "motion/react";
import { useAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { appAtom } from "~/globalStore/app";
import { timeout } from "~/lib/timeout";

function AppLoading() {
  const [{ isNavigating }, setApp] = useAtom(appAtom);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    timeout(1000).then(() =>
      setApp((prev) => ({ ...prev, isNavigating: false })),
    );
  }, [pathname, searchParams, setApp]);

  useEffect(() => {
    return () => {
      setApp((prev) => ({ ...prev, isNavigating: true }));
    };
  }, [pathname, searchParams, setApp]);

  return (
    <div className="fixed left-0 right-0">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            animate={{ width: ["0%", "80%"] }}
            transition={{ duration: 1 }}
            className="h-1 bg-(--accent-color)"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppLoading;
