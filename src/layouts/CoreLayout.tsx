"use client";

import React, { type ReactNode } from "react";
import SidebarWrapper from "~/components/Menus/SidebarWrapper";
import type { ChildrenProps } from "~/types/children-props";
import { cn } from "~/lib/utils";

interface Props {
  children: ReactNode;
  homePath?: string;
}

function CoreLayout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex min-h-0 h-full">{children}</div>
    </div>
  );
}

interface ContentProps extends ChildrenProps {
  className?: string;
}

export function CoreLayoutContent({ className, children }: ContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className={cn("flex-1 transition-all flex flex-col mt-4", className)}>
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
