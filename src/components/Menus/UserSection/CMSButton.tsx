"use client";
import { SquareTerminal } from "lucide-react";
import { useRouter } from "next/navigation";

function CMSButton() {
  const router = useRouter();
  const handleGoToCMS = () => router.push("/cms");

  return (
    <button
      onClick={handleGoToCMS}
      className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
    >
      <SquareTerminal size="1rem" />
      <h6 className="text-sm">Go to CMS</h6>
    </button>
  );
}

export default CMSButton;
