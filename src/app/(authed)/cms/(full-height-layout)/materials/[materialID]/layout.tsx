import { Provider as JotaiProvider } from "jotai";

import type { ChildrenProps } from "~/types/children-props";
function MaterialLayout({ children }: ChildrenProps) {
  return <JotaiProvider>{children}</JotaiProvider>;
}

export default MaterialLayout;
