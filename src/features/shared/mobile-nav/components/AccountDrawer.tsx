"use client";

import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import UserRole from "~/components/commons/UserRole";
import SignoutButton from "~/components/Menus/UserSection/SignoutButton";
import CMSButton from "~/components/Menus/UserSection/CMSButton";
import BackToHomeButton from "~/components/Menus/UserSection/BackToHomeButton";
import { useOpenSettings } from "~/globalStore/settings";
import { useSession } from "~/providers/SessionProvider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccountDrawer({ open, onOpenChange }: Props) {
  const { user } = useSession();
  const pathname = usePathname();
  const openSettings = useOpenSettings();

  const isCMS = pathname.startsWith("/cms");
  const hasCMSAccess =
    user.roles.includes("admin") || user.roles.includes("instructor");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Account</SheetTitle>
        </SheetHeader>

        <div className="flex gap-3 py-2">
          <UserProfileImage src={user.profileImage} username={user.username} />
          <div className="grid flex-1 space-y-0.5 text-left">
            <h4 className="truncate text-sm font-medium leading-tight text-(--gray-12)">
              {user.displayName}
            </h4>
            <h6 className="text-xs font-light text-(--gray-10)">
              @{user.username}
            </h6>
            <div className="flex flex-wrap gap-1 pt-1">
              {user.roles.map((role) => (
                <UserRole key={role} {...{ role }} />
              ))}
            </div>
          </div>
        </div>

        <hr className="my-2" />

        <button
          onClick={() => openSettings()}
          className="flex w-full items-center gap-1 rounded-lg py-2 pl-1.5 pr-4 hover:bg-(--gray-2)"
        >
          <Settings size="1rem" />
          <h6 className="flex-1 text-left text-sm">Settings</h6>
        </button>

        <hr className="my-2" />

        {hasCMSAccess ? isCMS ? <BackToHomeButton /> : <CMSButton /> : null}
        <SignoutButton />
      </SheetContent>
    </Sheet>
  );
}
