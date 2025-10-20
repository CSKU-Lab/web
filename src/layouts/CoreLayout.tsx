"use client";

import React, { type ReactNode } from "react";
import SidebarWrapper from "~/components/Menus/SidebarWrapper";
import type { ChildrenProps } from "~/types/children-props";
import { cn } from "~/lib/utils";

interface Props {
  children: ReactNode;
  homePath?: string;
  className?: string;
}

function CoreLayout({ children, className }: Props) {
  return (
    <div className={cn("h-screen flex bg-white", className)}>{children}</div>
  );
}

interface ContentProps extends ChildrenProps {
  className?: string;
}

export function CoreLayoutContent({ className, children }: ContentProps) {
  return (
    <div className="flex-1 transition-all overflow-auto min-h-0">
      <div
        className={cn(
          "max-w-[1920px] mx-auto flex flex-col",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CoreLayoutSidebar({ children }: ChildrenProps) {
  return (
    <SidebarWrapper>
      <h5 className="text-(--gray-12) font-medium">CS Lab</h5>
      {children}
    </SidebarWrapper>
  );
}

export default CoreLayout;
