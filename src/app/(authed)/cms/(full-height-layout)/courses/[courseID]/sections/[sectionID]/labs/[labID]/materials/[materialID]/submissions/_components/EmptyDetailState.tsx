import { Users } from "lucide-react";
import { FileX } from "lucide-react";
import type { SubmissionStatus } from "~/types/cms-section-submission";

interface EmptyDetailStateProps {
  status?: SubmissionStatus;
}

function EmptyDetailState({ status }: EmptyDetailStateProps) {
  if (status === "not_submitted") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-(--gray-11)">
        <FileX size="3rem" className="mb-3 opacity-50" />
        <p className="text-sm font-medium">No Submission</p>
        <p className="text-xs mt-1">This student has not submitted yet.</p>
      </div>
    );
  }

  if (status === "queued" || status === "running") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-(--gray-11)">
        <FileX size="3rem" className="mb-3 opacity-50" />
        <p className="text-sm font-medium">
          Submission {status === "queued" ? "Queued" : "Running"}
        </p>
        <p className="text-xs mt-1">
          This submission is currently {status}. Results will appear once
          processing is complete.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-(--gray-11)">
      <Users size="3rem" className="mb-3 opacity-50" />
      <p className="text-sm font-medium">No Student Selected</p>
      <p className="text-xs mt-1">
        Select a student from the list to view their submission.
      </p>
    </div>
  );
}

export default EmptyDetailState;
