"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import useResolvePath from "~/hooks/useResolvePath";
import { cn } from "~/lib/utils";

interface MenuButtonProps {
  href: string;
  name: React.ReactNode;
  layoutId: string;
}

const MenuButton = ({ name, href, layoutId }: MenuButtonProps) => {
  const resolve = useResolvePath();
  const currentPath = usePathname();
  const router = useRouter();

  const currentPathEnd = currentPath.split("/").pop() || "";
  const path = resolve(href);
  const pathEnd = path.split("/").pop() || "";
  const isActive = currentPathEnd === pathEnd;

  return (
    <button
      onClick={() => router.push(path)}
      className={cn(
        "relative px-3 py-2 rounded-lg text-(--gray-11) text-xs max-w-[160px] truncate",
        isActive
          ? "font-semibold text-accent-foreground"
          : "hover:text-(--gray-12) hover:font-medium",
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-lg bg-accent"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{name}</span>
    </button>
  );
};

interface NavigationMenusProps {
  menus: { name: string; href: string }[];
  className?: string;
}

function NavigationMenus({ menus, className }: NavigationMenusProps) {
  const layoutId = `nav-active-${menus.map((m) => m.href).join("-")}`;
  return (
    <LayoutGroup id={layoutId}>
      <div className={cn("mt-4 mb-8 ml-4 flex flex-wrap gap-1 w-full", className)}>
        {menus.map((menu) => (
          <MenuButton key={menu.name} layoutId={layoutId} {...menu} />
        ))}
      </div>
    </LayoutGroup>
  );
}

export default NavigationMenus;
