"use client";
import { DoorOpen } from "lucide-react";
import { useSession } from "~/providers/SessionProvider";

function SignoutButton() {
  const { signOut } = useSession();

  return (
    <button
      onClick={signOut}
      className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
    >
      <DoorOpen size="1rem" />
      <h6 className="text-sm">Sign out</h6>
    </button>
  );
}

export default SignoutButton;
