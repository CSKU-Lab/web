import React, { type ReactNode } from "react";
import Link from "next/link";
import SidebarWrapper from "~/components/Menus/SidebarWrapper";
import type { ChildrenProps } from "~/types/children-props";
import { cn } from "~/lib/utils";

interface Props {
  children: ReactNode;
  homePath?: string;
  className?: string;
}

function CoreLayout({ children, homePath = "/", className }: Props) {
  return (
    <div className={cn("h-screen flex bg-(--gray-1)", className)} data-home-path={homePath}>{children}</div>
  );
}

interface ContentProps extends ChildrenProps {
  className?: string;
}

export function CoreLayoutContent({ className, children }: ContentProps) {
  return (
    <div className="flex-1 transition-all overflow-auto min-h-0">
      <div className={cn("max-w-[1920px] mx-auto flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}

interface SidebarProps extends ChildrenProps {
  homePath?: string;
}

export function CoreLayoutSidebar({ children, homePath = "/" }: SidebarProps) {
  return (
    <SidebarWrapper>
      <Link href={homePath} className="text-(--gray-12) font-medium hover:text-(--accent-9) transition-colors block mb-2">
        CS Lab
      </Link>
      {children}
    </SidebarWrapper>
  );
}

export default CoreLayout;
