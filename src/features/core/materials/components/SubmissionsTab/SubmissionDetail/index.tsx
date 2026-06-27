import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import TestcaseTable from "~/features/core/materials/components/SubmissionsTab/SubmissionDetail/TestcaseTable";
import { SubmissionCard } from "~/features/core/materials/components/SubmissionsTab/SubmissionList/SubmissionCard/SubmissionCard";
import BackButton from "~/features/core/materials/components/SubmissionsTab/SubmissionDetail/BackButton";
import Loading from "~/features/core/materials/components/SubmissionsTab/SubmissionDetail/Loading";
import CodePreview from "~/components/Editor/CodePreview";
import { submissionAtom } from "~/globalStore/submissions";
import useSubmissionDetail from "~/features/core/materials/hooks/submission-detail/useSubmissionDetail";
import {
  submissionFilesAtom,
  submissionFilesEpochAtom,
  submissionTemplateFilesAtom,
} from "~/features/core/materials/stores/submission.store";
import { attachSolutionSegments } from "~/components/Editor/utils/segments";
import type { CodeFile } from "~/components/Editor/types/editor";

function SubmissionDetail() {
  const { materialID } = useParams<{ materialID: string }>();
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);
  const { data, isLoading, isError, refetch } =
    useSubmissionDetail(selectedSubmissionId);
  const setSubmissionFiles = useSetAtom(submissionFilesAtom);
  const setSubmissionFilesEpoch = useSetAtom(submissionFilesEpochAtom);
  const templateFiles = useAtomValue(submissionTemplateFilesAtom);

  const handleReplace = (files: CodeFile[]) => {
    // Submission files are flat content. Reconstruct segment structure from the
    // selected runner's template so the editor can enforce readonly ranges and
    // rebuild the submission payload. Files that can't be aligned stay plain.
    setSubmissionFiles(attachSolutionSegments(files, templateFiles));
    // Wholesale replacement — bump the epoch so the editor remounts and rebuilds
    // its readonly ranges from the reconstructed segments. Without this the
    // programmatic value reset is rejected by the readonly transaction filter
    // (so the code never lands) and the ranges stay aligned to the old content.
    setSubmissionFilesEpoch((e) => e + 1);
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <>
        <BackButton />
        <div className="flex flex-col items-center justify-center py-12 text-(--gray-11)">
          <AlertCircle className="h-8 w-8 text-(--tomato-11) mb-2" />
          <p className="text-sm text-(--tomato-11)">
            Failed to load submission
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs text-(--gray-11) underline hover:text-(--gray-12)"
          >
            Try again
          </button>
        </div>
      </>
    );
  }

  if (!data) return <Loading />;

  return (
    <>
      <BackButton />
      <SubmissionCard
        order={data.order}
        status={data.status}
        createdAt={data.created_at}
        onClick={() => {}}
      />
      <div className="mt-4">
        <CodePreview files={data.payload.files} className="mb-4 h-80" onReplace={handleReplace} />
      </div>
      <TestcaseTable isLoading={false} groups={data.payload.test_case_groups} />
    </>
  );
}

export default SubmissionDetail;
