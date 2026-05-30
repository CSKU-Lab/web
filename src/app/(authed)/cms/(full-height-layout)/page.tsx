import type { Metadata } from "next";
import ChatHome from "~/features/cms/layout/components/ChatHome";

export const metadata: Metadata = { title: "CMS | CS Lab" };

function CMSMainPage() {
  return <ChatHome />;
}

export default CMSMainPage;
