import { usePathname, useRouter } from "next/navigation";
import useResolvePath from "~/hooks/useResolvePath";
import { cn } from "~/lib/utils";

interface MenuButonProps {
  href: string;
  name: React.ReactNode;
}
const MenuButton = ({ name, href }: MenuButonProps) => {
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
        "px-3 py-2 rounded-lg text-(--gray-11) text-xs",
        isActive
          ? "font-semibold text-accent-foreground bg-accent"
          : "hover:text-(--gray-12) hover:font-semibold",
      )}
    >
      {name}
    </button>
  );
};

interface NavigationMenusProps {
  menus: {
    name: string;
    href: string;
  }[];
  className?: string;
}

function NavigationMenus({ menus, className }: NavigationMenusProps) {
  return (
    <div className={cn("mt-4 mb-8 ml-4 transition-all space-x-4", className)}>
      {menus.map((menu) => (
        <MenuButton key={menu.name} {...menu} />
      ))}
    </div>
  );
}

export default NavigationMenus;
