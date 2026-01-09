import React from "react";
import CoreLayout, {
  CoreLayoutContent,
  CoreLayoutSidebar,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import BreadcrumbClient from "../_components/BreadcrumbClient";
import SidebarMenus from "../_components/SidebarMenus";
import { getUser } from "~/lib/get-user";
import { getSidebarMenus } from "../_configs/sidebar-menus";

async function Layout({ children }: ChildrenProps) {
  const user = await getUser();
  const sidebarMenus = getSidebarMenus(user.roles);

  return (
    <CoreLayout homePath="/cms">
      <CoreLayoutSidebar>
        <h6 className="text-(--gray-11) text-xs font-light py-2">CMS</h6>
        <SidebarMenus config={sidebarMenus} />
      </CoreLayoutSidebar>
      <CoreLayoutContent className="h-full">
        <BreadcrumbClient className="pl-4 mt-4 mb-4" />
        {children}
      </CoreLayoutContent>
    </CoreLayout>
  );
}

export default Layout;
