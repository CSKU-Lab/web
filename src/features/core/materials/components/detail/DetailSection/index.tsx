"use client";

import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { renderStatus } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import { mapSubmissionStatus } from "~/features/core/materials/components/detail/DetailSection/mapSubmissionStatus";
import SubmitButton from "~/features/core/materials/components/detail/DetailSection/SubmitButton";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import { useAtom } from "jotai";
import { submissionStatusAtom } from "~/features/core/materials/stores/submission.store";

interface DetailSectionProps {
  sectionID: string;
  labID: string;
  materialID: string;
}

function DetailSection({ sectionID, labID, materialID }: DetailSectionProps) {
  const { data: material, isLoading } = useGetCoreMaterial();
  const [submissionStatus] = useAtom(submissionStatusAtom);

  // Use atom status if set (real-time), otherwise fallback to material API
  const displayStatus =
    submissionStatus !== "NO_SUBMISSION"
      ? submissionStatus
      : mapSubmissionStatus(material?.status);

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <HeaderItem label="Name" value={material?.name} isLoading={isLoading} />
        <HeaderItem
          label="Status"
          value={renderStatus(displayStatus)}
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
