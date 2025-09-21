"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/globalStore/sidebar";
import type { ReactNode } from "react";
import UserSection from "./UserSection";
import { PanelLeft } from "lucide-react";
import { SIDEBAR_WIDTH } from "~/constants";

interface Props {
  children: ReactNode;
}
function SidebarWrapper({ children }: Props) {
  const [{ isCollapse, width }, setSidebar] = useAtom(sidebarAtom);

  const toggleSidebar = () => {
    setSidebar((prev) => ({
      ...prev,
      isCollapse: !prev.isCollapse,
      width: prev.isCollapse ? SIDEBAR_WIDTH : 0,
    }));
  };

  const ToggleButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 text-(--gray-10) focus:outline-none focus:ring-2 focus:ring-(--gray-7) focus:ring-offset-2 mb-4 hover:text-(--accent-color) rounded-md z-50"
    >
      <PanelLeft size="1.25rem" />
    </button>
  );

  return (
    <>
      <ToggleButton />
      <AnimatePresence>
        <motion.nav
          initial={{ width }}
          animate={{ width }}
          className="top-0 bottom-0 flex flex-col justify-between border-r border-(--gray-4) bg-(--gray-2)"
        >
          {!isCollapse && (
            <>
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="px-4 flex-1 overflow-y-auto pt-12 pb-10"
              >
                {children}
              </motion.section>
              <UserSection />
            </>
          )}
        </motion.nav>
      </AnimatePresence>
    </>
  );
}

export default SidebarWrapper;
