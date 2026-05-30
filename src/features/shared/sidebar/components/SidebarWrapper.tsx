"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/globalStore/sidebar";
import type { ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { SIDEBAR_WIDTH } from "~/constants";
import UserSection from "~/components/Menus/UserSection";

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
}
function SidebarWrapper({ children }: Props) {
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
          className="flex flex-col justify-between border-r border-(--gray-4) bg-(--gray-2) p-4"
        >
          <ToggleButton toggleSidebar={toggleSidebar} />
          {!isCollapse && (
            <>
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex-1 overflow-y-auto pb-10"
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
