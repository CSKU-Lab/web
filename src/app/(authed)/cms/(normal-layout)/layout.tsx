import React from "react";
import CoreLayout, {
  CoreLayoutContent,
  CoreLayoutSidebar,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import SidebarMenus from "../_components/SidebarMenus";
import BreadcrumbClient from "../_components/BreadcrumbClient";

async function Layout({ children }: ChildrenProps) {
  return (
    <CoreLayout homePath="/cms">
      <CoreLayoutSidebar>
        <h6 className="text-(--gray-11) text-xs font-light py-2">CMS</h6>
        <SidebarMenus />
      </CoreLayoutSidebar>
      <CoreLayoutContent>
        <BreadcrumbClient className="pl-4 mt-4" />
        {children}
      </CoreLayoutContent>
    </CoreLayout>
  );
}

export default Layout;
