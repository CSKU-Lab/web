import type { CodeSubmissionResultStatus } from "~/types/core-code-submission";

interface StatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<CodeSubmissionResultStatus, StatusConfig> = {
  RUN_PASSED: { label: "Passed", className: "text-(--grass-11)" },
  RUN_FAILED: { label: "Failed", className: "text-(--tomato-11)" },
  COMPILE_FAILED: { label: "Compile Error", className: "text-(--tomato-11)" },
  GRADER_ERROR: { label: "Grader Error", className: "text-(--tomato-11)" },
  TIME_LIMIT_EXCEEDED: { label: "TLE", className: "text-(--yellow-11)" },
  MEMORY_LIMIT_EXCEEDED: { label: "MLE", className: "text-(--yellow-11)" },
  RUNTIME_ERROR: { label: "Runtime Error", className: "text-(--tomato-11)" },
  SIGNAL_ERROR: { label: "Signal Error", className: "text-(--tomato-11)" },
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    statusConfig[status as CodeSubmissionResultStatus] ?? {
      label: status,
      className: "text-(--gray-11)",
    }
  );
}
