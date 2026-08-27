"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import type { SidebarMenuCategory } from "~/types/sidebar-menu";

interface Props {
  config: SidebarMenuCategory[];
  collapsed?: boolean;
}

function SidebarMenus({ config, collapsed = false }: Props) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        {config.flatMap(({ menus }) =>
          menus.map(({ label, icon, href }) => {
            const isActive = pathname.startsWith(href);

            return (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    aria-label={label}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-(--gray-10) hover:bg-(--gray-4) hover:text-(--gray-11)",
                      isActive &&
                        "bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground/90",
                    )}
                  >
                    {icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          }),
        )}
      </div>
    );
  }

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
