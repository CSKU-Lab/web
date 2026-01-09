import React, { type Children, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";

interface Children {
  children?: ReactNode;
  className?: string;
}

export function Card({
  children,
  onClick,
  className,
}: Children & {
  onClick?: () => void;
}) {
  return (
    <button
      {...{ onClick }}
      disabled={typeof onClick === "undefined"}
      className={cn(
        "border flex justify-between items-center gap-2 px-4 py-2 rounded-lg bg-(--gray-2) border-(--gray-6) w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const CardContent = ({ children, className }: Children) => (
  <div className={cn("flex flex-col items-start", className)}>{children}</div>
);
export const CardStatusLine = ({ children, className }: Children) => (
  <div className={cn("flex items-center gap-2 text-xs", className)}>
    {children}
  </div>
);

export const Order = ({ children, className }: Children) => (
  <h5 className={cn("font-medium text-(--gray-12)", className)}>
    Submission #{children}
  </h5>
);

export const Status = ({ children, className }: Children) => (
  <h6 className={cn("text-(--gray-11) font-semibold", className)}>{children}</h6>
);

export const SubmissionDate = ({ date }: { date: Date }) => {
  const formattedDate = dayjs(date).format("DD MMMM YYYY HH:mm:ss");
  return <h6 className="mt-1 text-xs text-(--gray-11)">{formattedDate}</h6>;
};

export const Testcase = ({
  correctCase,
  totalCase,
  className,
}: Children & {
  correctCase: number;
  totalCase: number;
}) => (
  <h6 className={cn("text-(--gray-11)", className)}>
    {correctCase}/{totalCase} Testcases
  </h6>
);
