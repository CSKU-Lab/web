import {
  Book,
  CalendarDays,
  ChartColumn,
  SquareChartGantt,
  Terminal,
  UserRound,
} from "lucide-react";
import type { SidebarMenuCategory } from "~/types/sidebar-menu";
import type { User } from "~/types/user";

export const getSidebarMenus = (
  roles: User["roles"],
): SidebarMenuCategory[] => {
  const categories: SidebarMenuCategory[] = [
    {
      category: null,
      menus: [
        {
          icon: <Book size="1rem" />,
          label: "Courses",
          href: "/cms/courses",
        },
      ],
    },
  ];

  if (roles.includes("admin")) {
    categories.push({
      category: "Management",
      menus: [
        {
          icon: <ChartColumn size="1rem" />,
          label: "Analytics",
          href: "/cms/analytics",
        },
        {
          icon: <UserRound size="1rem" />,
          label: "Users Management",
          href: "/cms/users",
        },
        {
          icon: <CalendarDays size="1rem" />,
          label: "Semesters Management",
          href: "/cms/semesters",
        },
      ],
    });

    categories.push({
      category: "Configs",
      menus: [
        {
          icon: <Terminal size="1rem" />,
          label: "Runners",
          href: "/cms/runners",
        },
        {
          icon: <SquareChartGantt size="1rem" />,
          label: "Compares",
          href: "/cms/compares",
        },
      ],
    });
  }

  return categories;
};
