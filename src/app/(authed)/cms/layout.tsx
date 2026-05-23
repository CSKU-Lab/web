import type { ChildrenProps } from "~/types/children-props";
import CommandPalette from "~/components/CommandPalette";

export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <CommandPalette />
      {children}
    </>
  );
}
