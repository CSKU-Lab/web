import type { StatusType } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import type { MaterialStatus } from "~/types/core-submission";

export function mapSubmissionStatus(
  status: MaterialStatus | undefined,
): StatusType {
  if (!status) return "NO_SUBMISSION";

  switch (status) {
    case "passed":
      return "PASSED";
    case "failed":
      return "FAILED";
    case "queued":
    case "running":
      return "GRADING";
    case "partial":
      return "PARTIAL";
    default:
      return "NO_SUBMISSION";
  }
}
