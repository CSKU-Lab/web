import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { submissionAtom } from "~/globalStore/submissions";

function BackButton() {
  const [_, setSubmissionAtom] = useAtom(submissionAtom);

  return (
    <button
      onClick={() => setSubmissionAtom({ selectedSubmissionId: null })}
      className="inline-flex items-center gap-2 text-(--gray-11) hover:text-(--gray-12) mb-4"
    >
      <ArrowLeft />
      <h6 className="text-xs">All Submissions</h6>
    </button>
  );
}

export default BackButton;
