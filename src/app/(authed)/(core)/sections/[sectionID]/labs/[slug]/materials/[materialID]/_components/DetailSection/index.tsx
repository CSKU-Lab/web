"use client";

import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { renderStatus, type StatusType } from "./renderStatus";
import SubmitButton from "./SubmitButton";
import useGetCoreMaterial from "../../_hooks/useGetCoreMaterial";
import type { SubmissionStatus } from "~/types/core-submission";

interface DetailSectionProps {
  sectionID: string;
  labID: string;
  materialID: string;
}

function mapSubmissionStatus(status: SubmissionStatus | undefined): StatusType {
  if (!status) return "NO_SUBMISSION";

  switch (status) {
    case "passed":
      return "PASSED";
    case "failed":
      return "FAILED";
    case "queued":
    case "running":
      return "GRADING";
    default:
      return "NO_SUBMISSION";
  }
}

function DetailSection({ sectionID, labID, materialID }: DetailSectionProps) {
  const { data: material, isLoading } = useGetCoreMaterial();

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <HeaderItem label="Name" value={material?.name} isLoading={isLoading} />
        <HeaderItem
          label="Status"
          value={renderStatus(mapSubmissionStatus(material?.status))}
          isLoading={isLoading}
        />
      </div>
      <SubmitButton
        sectionID={sectionID}
        labID={labID}
        materialID={materialID}
      />
    </div>
  );
}

export default DetailSection;
