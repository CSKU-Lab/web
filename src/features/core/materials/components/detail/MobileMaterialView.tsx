"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { renderStatus } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import { mapSubmissionStatus } from "~/features/core/materials/components/detail/DetailSection/mapSubmissionStatus";
import { submissionStatusAtom } from "~/features/core/materials/stores/submission.store";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import DescriptionTab from "~/features/core/materials/components/DescriptionTab";
import SubmissionsTab from "~/features/core/materials/components/SubmissionsTab";
import DocumentViewer from "~/features/core/materials/components/detail/DocumentViewer";
import { MaterialType } from "~/types/core-material";
import { cn } from "~/lib/utils";

interface TabButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  value: string;
}

const TabButton = ({ isActive, onClick, value }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 border-b border-r p-2 text-(--gray-11) hover:bg-(--gray-2)",
      isActive && "bg-(--gray-12) text-(--gray-1) hover:bg-(--gray-12)/90",
    )}
  >
    <h4 className="text-xs">{value}</h4>
  </button>
);

interface Props {
  initialType: string;
}

/**
 * Mobile-only, view-only rendering of a course material. Documents render in
 * the normal viewer; code labs show the description and past submissions
 * (read-only) without the editor or a submit action; typing practice is not
 * supported on mobile and shows a hint to use a desktop instead.
 */
export default function MobileMaterialView({ initialType }: Props) {
  const { data: material, isLoading } = useGetCoreMaterial();
  const [submissionStatus] = useAtom(submissionStatusAtom);
  const [tab, setTab] = useState<"description" | "submissions">("description");

  const type = material?.type ?? initialType;

  if (type === MaterialType.DOCUMENT) {
    return (
      <div className="flex h-full flex-col">
        <DocumentViewer />
      </div>
    );
  }

  if (type === MaterialType.TYPE || (type as string) === "typing") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h2 className="text-sm font-medium">Typing practice needs a desktop</h2>
        <p className="text-xs text-(--gray-11)">
          Open this material on a computer with a physical keyboard to practice
          typing.
        </p>
      </div>
    );
  }

  // CODE material — view-only: description + past submissions.
  const displayStatus =
    submissionStatus !== "NO_SUBMISSION"
      ? submissionStatus
      : mapSubmissionStatus(material?.status);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 border-b px-4 py-3">
        <HeaderItem label="Name" value={material?.name} isLoading={isLoading} />
        <HeaderItem
          label="Status"
          value={renderStatus(displayStatus)}
          isLoading={isLoading}
        />
      </div>

      <div className="flex">
        <TabButton
          value="Description"
          isActive={tab === "description"}
          onClick={() => setTab("description")}
        />
        <TabButton
          value="Submissions"
          isActive={tab === "submissions"}
          onClick={() => setTab("submissions")}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "description" ? <DescriptionTab /> : <SubmissionsTab />}
      </div>
    </div>
  );
}
