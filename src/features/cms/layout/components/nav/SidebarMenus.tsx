"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "~/lib/utils";
import type { SidebarMenuCategory } from "~/types/sidebar-menu";

interface Props {
  config: SidebarMenuCategory[];
}

function SidebarMenus({ config }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {config.map(({ category, menus }) => {
        const render = [];
        if (category) {
          render.push(
            <h6 key={category} className="text-xs text-(--gray-11) font-light">
              {category}
            </h6>,
          );
        }

        menus.forEach(({ label, icon, href }) => {
          const isActive = pathname.startsWith(href);
          render.push(
            <Link
              {...{ href }}
              key={category !== null ? `${category}-${label}` : label}
              className={cn(
                "flex items-center gap-1.5 text-(--gray-10) p-2 hover:bg-(--gray-4) rounded-lg hover:text-(--gray-11) w-full",
                isActive &&
                  "bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg hover:text-accent-foreground/90",
              )}
            >
              {icon}
              <p key={`${label}-label`} className="text-xs">
                {label}
              </p>
            </Link>,
          );
        });
        return <Fragment key={category}>{render}</Fragment>;
      })}
    </div>
  );
}

export default SidebarMenus;
