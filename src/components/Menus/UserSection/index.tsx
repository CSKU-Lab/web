"use client";
import { EllipsisVertical, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import UserProfileImage from "../UserProfileImage";
import UserRole from "~/components/commons/UserRole";
import SignoutButton from "./SignoutButton";
import CMSButton from "./CMSButton";
import BackToHomeButton from "./BackToHomeButton";
import { useOpenSettings } from "~/globalStore/settings";
import { useSession } from "~/providers/SessionProvider";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { isMac } from "~/lib/tiptap-utils";

function UserSection() {
  const { user } = useSession();
  const pathname = usePathname();
  const openSettings = useOpenSettings();

  const mac = isMac();

  const isCMS = pathname.startsWith("/cms");
  const hasCMSAccess =
    user.roles.includes("admin") || user.roles.includes("instructor");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="p-2 flex items-center gap-3 hover:bg-(--gray-4) rounded-lg"
        >
          <UserProfileImage src={user.profileImage} username={user.username} />
          <div className="flex-1 space-y-0.5 grid text-left">
            <h4 className="text-sm font-medium truncate text-(--gray-12) leading-tight">
              {user.displayName}
            </h4>
            <h6 className="text-xs font-light text-(--gray-10)">
              @{user.username}
            </h6>
          </div>
          <EllipsisVertical size="1rem" className="shrink-0 text-(--gray-11)" />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <div className="px-2 py-4 flex gap-3 rounded-lg">
          <UserProfileImage src={user.profileImage} username={user.username} />
          <div className="flex-1 space-y-0.5 grid text-left">
            <h4 className="text-sm font-medium truncate text-(--gray-12) leading-tight">
              {user.displayName}
            </h4>
            <h6 className="text-xs font-light text-(--gray-10)">
              @{user.username}
            </h6>
            <div className="pt-1 flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <UserRole key={role} {...{ role }} />
              ))}
            </div>
          </div>
        </div>
        <hr />
        <div className="p-2">
          <button
            onClick={() => openSettings()}
            className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
          >
            <Settings size="1rem" />
            <h6 className="text-sm flex-1 text-left">Settings</h6>
            <KbdGroup>
              <Kbd>{mac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>,</Kbd>
            </KbdGroup>
          </button>
        </div>
        <hr />
        <div className="p-2">
          {hasCMSAccess ? isCMS ? <BackToHomeButton /> : <CMSButton /> : null}
          <SignoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserSection;
