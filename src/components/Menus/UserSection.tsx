import { motion } from "motion/react";
import { DoorOpen, EllipsisVertical, SquareTerminal } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useSession } from "~/providers/SessionProvider";
import UserProfileImage from "./UserProfileImage";
import UserRole from "../commons/UserRole";

function UserSection() {
  const { user, signOut } = useSession();

  const router = useRouter();
  const handleGoToCMS = () => router.push("/cms");

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
            onClick={handleGoToCMS}
            className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
          >
            <SquareTerminal size="1rem" />
            <h6 className="text-sm">Go to CMS</h6>
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
          >
            <DoorOpen size="1rem" />
            <h6 className="text-sm">Sign out</h6>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserSection;
