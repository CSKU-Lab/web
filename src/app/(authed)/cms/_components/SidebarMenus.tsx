"use client";

import { Book, CalendarDays, Library, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";
import { cn } from "~/lib/utils";

interface Menu {
  icon: () => React.ReactNode;
  label: string;
  href: string;
}

interface Category {
  category: string | null;
  menus: Menu[];
}

function SidebarMenus() {
  const categories: Category[] = useMemo(
    () => [
      {
        category: null,
        menus: [
          {
            icon: () => <Book size="1rem" />,
            label: "Courses",
            href: "/cms/courses",
          },
          {
            icon: () => <Library size="1rem" />,
            label: "Materials",
            href: "/cms/materials",
          },
        ],
      },
      {
        category: "Management",
        menus: [
          {
            icon: () => <UserRound size="1rem" />,
            label: "Users Management",
            href: "/cms/users",
          },
          {
            icon: () => <CalendarDays size="1rem" />,
            label: "Semesters Management",
            href: "/cms/semesters",
          },
        ],
      },
    ],
    [],
  );

  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {categories.map(({ category, menus }) => {
        const render = [];
        if (category) {
          render.push(
            <h6 key={category} className="text-xs text-(--gray-11) font-light">
              {category}
            </h6>,
          );
        }

        menus.forEach(({ label, icon: Icon, href }) => {
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
              <Icon key={`${label}-icon`} />
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
