"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/globalStore/sidebar";
import type { ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { SIDEBAR_WIDTH } from "~/constants";
import UserSection from "./UserSection";
import { cn } from "~/lib/utils";

const ToggleButton = ({ toggleSidebar }: { toggleSidebar: () => void }) => (
  <button
    onClick={toggleSidebar}
    className="text-(--gray-10) focus:outline-none focus:ring-2 focus:ring-(--gray-7) focus:ring-offset-2 mb-4 hover:text-accent rounded-md z-50 w-fit"
  >
    <PanelLeft size="1.25rem" />
  </button>
);

interface Props {
  children: ReactNode;
  collapsedChildren?: ReactNode;
}
function SidebarWrapper({ children, collapsedChildren }: Props) {
  const [{ isCollapse }, setSidebar] = useAtom(sidebarAtom);

  const toggleSidebar = () => {
    setSidebar((prev) => ({
      ...prev,
      isCollapse: !prev.isCollapse,
    }));
  };

  return (
    <>
      <AnimatePresence>
        <motion.nav
          initial={{ width: isCollapse ? 54 : SIDEBAR_WIDTH }}
          animate={{ width: isCollapse ? 54 : SIDEBAR_WIDTH }}
          className={cn(
            "flex flex-col border-r border-(--gray-4) bg-(--gray-2) p-4 min-h-0",
            isCollapse ? "justify-start" : "justify-between",
          )}
        >
          <ToggleButton toggleSidebar={toggleSidebar} />
          {isCollapse ? (
            collapsedChildren && (
              <section className="mt-2 flex flex-col items-center gap-2">
                {collapsedChildren}
              </section>
            )
          ) : (
            <>
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {children}
              </motion.section>
              <div className="relative z-10 w-full shrink-0 bg-(--gray-2)">
                <UserSection />
              </div>
            </>
          )}
        </motion.nav>
      </AnimatePresence>
    </>
  );
}

export default SidebarWrapper;
