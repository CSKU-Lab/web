import { Book, CalendarDays, Library, UserRound } from "lucide-react";
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
        {
          icon: <Library size="1rem" />,
          label: "Materials",
          href: "/cms/materials",
        },
      ],
    },
  ];

  if (roles.includes("admin")) {
    categories.push({
      category: "Management",
      menus: [
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
  }

  return categories;
};
