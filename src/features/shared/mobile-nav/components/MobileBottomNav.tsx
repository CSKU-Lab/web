"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { BookOpen, CircleUser, Home, Search } from "lucide-react";
import { coreCommandPaletteAtom } from "~/globalStore/coreCommandPalette";
import { cn } from "~/lib/utils";
import CoursesDrawer from "./CoursesDrawer";
import AccountDrawer from "./AccountDrawer";

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function TabButton({ icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-(--gray-10) transition-colors",
        active && "text-(--accent-9)",
      )}
    >
      {icon}
      <span className="text-[0.625rem] font-medium leading-none">{label}</span>
    </button>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const setPalette = useSetAtom(coreCommandPaletteAtom);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const iconSize = "1.25rem";

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-(--gray-4) bg-(--gray-2) pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className="flex flex-1">
          <TabButton
            icon={<Home size={iconSize} />}
            label="Home"
            active={pathname === "/"}
          />
        </Link>
        <TabButton
          icon={<Search size={iconSize} />}
          label="Search"
          onClick={() => setPalette({ isOpen: true })}
        />
        <TabButton
          icon={<BookOpen size={iconSize} />}
          label="Courses"
          active={coursesOpen}
          onClick={() => setCoursesOpen(true)}
        />
        <TabButton
          icon={<CircleUser size={iconSize} />}
          label="Account"
          active={accountOpen}
          onClick={() => setAccountOpen(true)}
        />
      </nav>

      <CoursesDrawer open={coursesOpen} onOpenChange={setCoursesOpen} />
      <AccountDrawer open={accountOpen} onOpenChange={setAccountOpen} />
    </>
  );
}
