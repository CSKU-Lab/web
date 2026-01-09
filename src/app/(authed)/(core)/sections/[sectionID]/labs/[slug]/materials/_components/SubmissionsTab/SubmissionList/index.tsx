import React from "react";
import { FailedCard, PassedCard, QueueCard } from "./SubmissionCard";
import { useAtom } from "jotai";
import { submissionAtom } from "~/globalStore/submissions";

function SubmissionList() {
  const [_, setSubmissionAtom] = useAtom(submissionAtom);

  return (
    <div className="space-y-4">
      <h4 className="text-(--gray-12) font-medium text-sm">Your Submissions</h4>
      <PassedCard
        onClick={() =>
          setSubmissionAtom({ selectedSubmissionId: "third-time" })
        }
        order={3}
        totalCase={20}
      />
      <QueueCard
        onClick={() =>
          setSubmissionAtom({ selectedSubmissionId: "second-time" })
        }
        order={2}
      />
      <FailedCard
        onClick={() =>
          setSubmissionAtom({ selectedSubmissionId: "first-time" })
        }
        order={1}
        correctCase={10}
        totalCase={20}
      />
    </div>
  );
}

export default SubmissionList;
