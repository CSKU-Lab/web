import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";

export const metadata: Metadata = { title: "New Material | CS Lab" };

export default function Layout({ children }: ChildrenProps) {
  return children;
}
