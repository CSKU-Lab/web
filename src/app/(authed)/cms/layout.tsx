import type { ChildrenProps } from "~/types/children-props";
import CommandPalette from "~/features/shared/search/components/CommandPalette";

export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  );
}
