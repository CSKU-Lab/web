import type { Metadata } from "next";
import { OverviewView } from "~/features/cms/overview";

export const metadata: Metadata = { title: "CMS | CS Lab" };

function CMSMainPage() {
  return <OverviewView />;
}

export default CMSMainPage;
