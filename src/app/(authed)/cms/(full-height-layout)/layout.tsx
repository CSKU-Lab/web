import React from "react";
import CoreLayout, {
  CoreLayoutContent,
  CoreLayoutSidebar,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import BreadcrumbClient from "~/features/cms/layout/components/nav/BreadcrumbClient";
import { BreadcrumbProvider } from "~/features/cms/layout/components/nav/BreadcrumbProvider";
import SidebarMenus from "~/features/cms/layout/components/nav/SidebarMenus";
import SearchBar from "~/features/cms/layout/components/nav/SearchBar";
import { getUser } from "~/lib/get-user";
import { getSidebarMenus } from "~/features/cms/layout/configs/sidebar-menus";

async function Layout({ children }: ChildrenProps) {
  const user = await getUser();
  const sidebarMenus = getSidebarMenus(user.roles);

  return (
    <CoreLayout homePath="/cms">
      <CoreLayoutSidebar homePath="/cms">
        <h6 className="text-(--gray-11) text-xs font-light py-2">CMS</h6>
        <SearchBar />
        <SidebarMenus config={sidebarMenus} />
      </CoreLayoutSidebar>
      <CoreLayoutContent className="h-full">
        <BreadcrumbProvider>
          <BreadcrumbClient className="pl-4 mt-4" />
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
            {children}
          </div>
        </BreadcrumbProvider>
      </CoreLayoutContent>
    </CoreLayout>
  );
}

export default Layout;
