"use client";

import { CloudUpload, Loader2, Timer } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { SubmitCooldownState } from "~/hooks/useSubmitCooldown";

interface SubmitCooldownButtonProps {
  onClick: () => void;
  cooldown: SubmitCooldownState;
  /** True while the submission request is in flight / grading. */
  isSubmitting: boolean;
  /** Extra disable conditions on top of submitting + cooldown. */
  disabled?: boolean;
  /** Margin class for the leading icon (varies per call site). */
  iconClassName?: string;
}

/**
 * Submit button with a built-in cooldown. While cooling down it is disabled,
 * shows a "Wait Ns" countdown, and a bar depletes left-to-right to visualise
 * the remaining time.
 */
export function SubmitCooldownButton({
  onClick,
  cooldown,
  isSubmitting,
  disabled = false,
  iconClassName = "mr-2 h-3 w-3",
}: SubmitCooldownButtonProps) {
  const { isCoolingDown, remainingSeconds, progress } = cooldown;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled || isSubmitting || isCoolingDown}
      className="relative overflow-hidden"
    >
      {isCoolingDown && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 right-0 origin-left bg-(--gray-5) transition-none"
          style={{ transform: `scaleX(${Math.max(0, 1 - progress)})` }}
        />
      )}
      <span className="relative flex items-center">
        {isSubmitting ? (
          <>
            <Loader2 className={cn("animate-spin", iconClassName)} />
            Submitting...
          </>
        ) : isCoolingDown ? (
          <>
            <Timer className={iconClassName} />
            Cooldown {remainingSeconds}s
          </>
        ) : (
          <>
            <CloudUpload className={iconClassName} />
            Submit
          </>
        )}
      </span>
    </Button>
  );
}
