import React from "react";
import CoreLayout, {
  CoreLayoutContent,
  CoreLayoutSidebar,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import SidebarMenus from "~/features/cms/layout/components/nav/SidebarMenus";
import SearchBar from "~/features/cms/layout/components/nav/SearchBar";
import BreadcrumbClient from "~/features/cms/layout/components/nav/BreadcrumbClient";
import { BreadcrumbProvider } from "~/features/cms/layout/components/nav/BreadcrumbProvider";
import { getUser } from "~/lib/get-user";
import { getSidebarMenus } from "~/features/cms/layout/configs/sidebar-menus";
import ReleaseNoteDialog from "~/features/cms/release-notes/components/ReleaseNoteDialog";

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
      <CoreLayoutContent>
        <BreadcrumbProvider>
          <BreadcrumbClient className="pl-4 mt-4" />
          {children}
        </BreadcrumbProvider>
      </CoreLayoutContent>
      <ReleaseNoteDialog />
    </CoreLayout>
  );
}

export default Layout;
