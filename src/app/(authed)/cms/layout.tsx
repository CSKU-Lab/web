import React from "react";
import CoreLayout, {
  CoreLayoutContent,
  CoreLayoutSidebar,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import BreadcrumbClient from "./_components/BreadcrumbClient";
import SidebarMenus from "./_components/SidebarMenus";

async function Layout({ children }: ChildrenProps) {
  return (
    <CoreLayout homePath="/cms">
      <CoreLayoutSidebar>
        <h6 className="text-(--gray-11) text-xs font-light py-2">CMS</h6>
        <SidebarMenus />
      </CoreLayoutSidebar>
      <CoreLayoutContent className="pl-10 py-4 pr-4 min-h-0 gap-2 w-full max-w-[1920px] mx-auto">
        <BreadcrumbClient />
        {children}
      </CoreLayoutContent>
    </CoreLayout>
  );
}

export default Layout;
