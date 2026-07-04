import { type Metadata } from "next";
import CoreLayout, {
  CoreLayoutSidebar,
  CoreLayoutContent,
} from "~/layouts/CoreLayout";
import MobileCoreLayout from "~/layouts/MobileCoreLayout";
import type { ChildrenProps } from "~/types/children-props";
import Sidebar from "~/features/shared/sidebar/components/Sidebar";
import CoreCommandPalette from "~/features/shared/search/components/CoreCommandPalette";
import MobileProvider from "~/providers/MobileProvider";
import { getIsMobile } from "~/lib/get-is-mobile";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

async function Layout({ children }: ChildrenProps) {
  const isMobile = await getIsMobile();

  return (
    <MobileProvider isMobile={isMobile}>
      <CoreCommandPalette />
      {isMobile ? (
        <MobileCoreLayout>{children}</MobileCoreLayout>
      ) : (
        <CoreLayout>
          <CoreLayoutSidebar>
            <Sidebar />
          </CoreLayoutSidebar>
          <CoreLayoutContent className="h-full">{children}</CoreLayoutContent>
        </CoreLayout>
      )}
    </MobileProvider>
  );
}

export default Layout;
