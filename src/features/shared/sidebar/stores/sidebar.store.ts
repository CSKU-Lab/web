import { atom } from "jotai";
import { SIDEBAR_WIDTH } from "~/constants";

interface SidebarStore {
  isCollapse: boolean;
  width: number | string;
}

export const sidebarAtom = atom<SidebarStore>({
  isCollapse: false,
  width: SIDEBAR_WIDTH,
});

export const toggleSidebarAtom = atom(null, (get, set, _) => {
  const isCollapse = get(sidebarAtom).isCollapse;
  set(sidebarAtom, {
    isCollapse: !isCollapse,
    width: isCollapse ? SIDEBAR_WIDTH : 0,
  });
});
