"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import Sidebar from "~/features/shared/sidebar/components/Sidebar";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CoursesDrawer({ open, onOpenChange }: Props) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  // Close the drawer once the user navigates to a course/material.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-4/5 max-w-sm flex-col p-4">
        <SheetHeader className="sr-only p-0">
          <SheetTitle>My Courses</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <Sidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
