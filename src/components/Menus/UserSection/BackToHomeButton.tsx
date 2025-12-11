"use client";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

function BackToHomeButton() {
  const router = useRouter();
  const handleGoToCMS = () => router.push("/");

  return (
    <button
      onClick={handleGoToCMS}
      className="flex items-center gap-1 hover:bg-(--gray-2) w-full pl-1.5 pr-4 py-2 rounded-lg"
    >
      <Home size="1rem" />
      <h6 className="text-sm">Back to Home</h6>
    </button>
  );
}

export default BackToHomeButton;
