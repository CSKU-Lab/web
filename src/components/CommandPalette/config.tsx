import {
  Book,
  CalendarDays,
  SquareChartGantt,
  Terminal,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

export interface PaletteItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  group: string;
  keywords?: string[];
  adminOnly?: boolean;
}

export const navigationItems: PaletteItem[] = [
  {
    id: "courses",
    label: "Courses",
    href: "/cms/courses",
    icon: <Book size="1rem" />,
    group: "Navigation",
    keywords: ["course", "cms"],
  },
  {
    id: "users",
    label: "Users Management",
    href: "/cms/users",
    icon: <UserRound size="1rem" />,
    group: "Management",
    keywords: ["user", "admin", "manage"],
    adminOnly: true,
  },
  {
    id: "semesters",
    label: "Semesters Management",
    href: "/cms/semesters",
    icon: <CalendarDays size="1rem" />,
    group: "Management",
    keywords: ["semester", "term", "manage"],
    adminOnly: true,
  },
  {
    id: "runners",
    label: "Runners",
    href: "/cms/runners",
    icon: <Terminal size="1rem" />,
    group: "Configs",
    keywords: ["runner", "config", "execute"],
    adminOnly: true,
  },
  {
    id: "compares",
    label: "Compares",
    href: "/cms/compares",
    icon: <SquareChartGantt size="1rem" />,
    group: "Configs",
    keywords: ["compare", "config", "diff"],
    adminOnly: true,
  },
];
