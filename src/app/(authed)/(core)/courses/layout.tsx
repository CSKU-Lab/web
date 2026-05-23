import type { Metadata } from "next";
import type { ChildrenProps } from "~/types/children-props";

export const metadata: Metadata = { title: "Courses | CS Lab" };

export default function Layout({ children }: ChildrenProps) {
  return children;
}
