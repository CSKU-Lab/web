import { type Metadata } from "next";
import CoreLayout, {
  CoreLayoutSidebar,
  CoreLayoutContent,
} from "~/layouts/CoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import Sidebar from "~/features/shared/sidebar/components/Sidebar";
import CoreCommandPalette from "~/features/shared/search/components/CoreCommandPalette";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

function Layout({ children }: ChildrenProps) {
  return (
    <CoreLayout>
      <CoreCommandPalette />
      <CoreLayoutSidebar>
        <Sidebar />
      </CoreLayoutSidebar>
      <CoreLayoutContent className="h-full">{children}</CoreLayoutContent>
    </CoreLayout>
  );
}

export default Layout;
