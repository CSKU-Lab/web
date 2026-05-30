import { cn } from "~/lib/utils";

export type StatusType = "NO_SUBMISSION" | "PASSED" | "FAILED" | "GRADING";

export const renderStatus = (status: StatusType) => {
  let text = "";
  let colorClass = "";

  switch (status) {
    case "NO_SUBMISSION":
      text = "No Submission";
      colorClass = "bg-(--gray-9)";
      break;
    case "PASSED":
      text = "Passed";
      colorClass = "bg-(--grass-9)";
      break;
    case "FAILED":
      text = "Failed";
      colorClass = "bg-(--red-9)";
      break;
    case "GRADING":
      text = "Grading";
      colorClass = "bg-(--amber-9)";
      break;
  }

  return (
    <div className="flex gap-1.5 items-center">
      <div className={cn("w-2 h-2 rounded-full", colorClass)}></div>
      <h4 className="font-medium">{text}</h4>
    </div>
  );
};
