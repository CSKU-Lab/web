import type { CodeSubmissionResultStatus } from "~/types/core-code-submission";

interface StatusConfig {
  label: string;
  className: string;
  // Human-readable reason for the failure. Derived purely from the status code,
  // so it never leaks program output — safe to show students on hidden test
  // cases where the raw message is withheld. Empty for RUN_PASSED.
  description: string;
}

const statusConfig: Record<CodeSubmissionResultStatus, StatusConfig> = {
  RUN_PASSED: { label: "Passed", className: "text-(--grass-11)", description: "" },
  RUN_FAILED: {
    label: "Failed",
    className: "text-(--tomato-11)",
    description: "Your output did not match the expected output.",
  },
  COMPILE_FAILED: {
    label: "Compile Error",
    className: "text-(--tomato-11)",
    description: "Your code failed to compile.",
  },
  GRADER_ERROR: {
    label: "Grader Error",
    className: "text-(--tomato-11)",
    description: "The grader ran into an error while running your code.",
  },
  TIME_LIMIT_EXCEEDED: {
    label: "TLE",
    className: "text-(--yellow-11)",
    description: "Your program exceeded the time limit.",
  },
  MEMORY_LIMIT_EXCEEDED: {
    label: "MLE",
    className: "text-(--yellow-11)",
    description: "Your program exceeded the memory limit.",
  },
  RUNTIME_ERROR: {
    label: "Runtime Error",
    className: "text-(--tomato-11)",
    description: "Your program crashed while running.",
  },
  SIGNAL_ERROR: {
    label: "Signal Error",
    className: "text-(--tomato-11)",
    description: "Your program was terminated by a signal.",
  },
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    statusConfig[status as CodeSubmissionResultStatus] ?? {
      label: status,
      className: "text-(--gray-11)",
      description: "",
    }
  );
}
