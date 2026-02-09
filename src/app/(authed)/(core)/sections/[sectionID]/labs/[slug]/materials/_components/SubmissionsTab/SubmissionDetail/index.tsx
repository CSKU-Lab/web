import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import TestcaseTable from "./TestcaseTable";
import { SubmissionCard } from "../SubmissionList/SubmissionCard/SubmissionCard";
import BackButton from "./BackButton";
import Loading from "./Loading";
import CodePreview from "~/components/Editor/CodePreview";
import { submissionAtom } from "~/globalStore/submissions";
import useSubmissionDetail from "./_hooks/useSubmissionDetail";

function SubmissionDetail() {
  const { materialID } = useParams<{ materialID: string }>();
  const [{ selectedSubmissionId }] = useAtom(submissionAtom);
  const { data, isLoading, isError, refetch } =
    useSubmissionDetail(selectedSubmissionId);

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
        id={data.id}
        order={data.order}
        status={data.status}
        createdAt={data.created_at}
        materialID={materialID}
        onClick={() => {}}
      />
      <div className="mt-4">
        <CodePreview files={data.payload.files} className="mb-4" />
      </div>
      <TestcaseTable isLoading={false} groups={data.payload.test_case_groups} />
    </>
  );
}

export default SubmissionDetail;
