"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function TooManyRequestsPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    const stored = sessionStorage.getItem("rl_retry_after");
    const initial = stored ? parseInt(stored, 10) : 60;
    setSeconds(isNaN(initial) ? 60 : initial);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      const redirectTo = sessionStorage.getItem("rl_redirect_to") ?? "/";
      sessionStorage.removeItem("rl_retry_after");
      sessionStorage.removeItem("rl_redirect_to");
      router.replace(redirectTo);
      return;
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-screen p-4">
      <div className="bg-(--gray-3) rounded-full p-4 text-(--gray-11)">
        <ShieldAlert size="2rem" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-medium text-(--gray-12) text-center">
          Too Many Requests
        </h4>
        <p className="text-(--gray-11) text-center">
          You&apos;re sending requests too quickly. Please wait before
          continuing.
        </p>
      </div>
      <p className="text-(--gray-11) text-sm">
        Redirecting in{" "}
        <span className="font-semibold text-(--gray-12)">{seconds}</span>{" "}
        {seconds === 1 ? "second" : "seconds"}...
      </p>
    </div>
  );
}

export default TooManyRequestsPage;
