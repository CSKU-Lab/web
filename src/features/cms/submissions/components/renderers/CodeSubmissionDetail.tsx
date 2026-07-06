import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  HardDrive,
  CircleDashed,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "~/components/ui/label";
import CodePreview from "~/components/Editor/CodePreview";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { CMSMaterial } from "~/types/cms-material";
import ManualScoreInput from "~/features/cms/submissions/components/renderers/ManualScoreInput";
import TestcaseTable from "~/features/core/materials/components/SubmissionsTab/SubmissionDetail/TestcaseTable";

interface CodeSubmissionDetailProps {
  material: CMSMaterial;
  created_at: string;
  payload: CodeSubmissionData | null;
  auto_score: number;
  manual_score: number;
}

function formatTime(ms: number): string {
  if (ms <= 0) return "-";
  return `${ms.toFixed(2)}ms`;
}

function formatMemory(bytes: number): string {
  if (bytes <= 0) return "-";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function CodeSubmissionDetail({
  material,
  created_at,
  payload,
  auto_score,
  manual_score,
}: CodeSubmissionDetailProps) {
  const params = useParams();
  const sectionId = params.sectionID as string;
  const labId = params.labID as string;
  const materialId = params.materialID as string;

  const [isDescriptionOpen, setDescriptionOpen] = useState(false);

  if (payload === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 text-(--gray-11)">
        <CircleDashed size="2rem" />
        <span className="text-sm">No submission data available.</span>
      </div>
    );
  }

  // Calculate max possible score from all test case groups
  const maxAutoScore =
    payload.test_case_groups?.reduce((total, group) => total + group.score, 0) ??
    0;

  return (
    <div className="p-4 pt-0 space-y-4 overflow-auto">
      <div className="space-y-1">
        <button
          type="button"
          className="flex items-center justify-between w-full text-sm font-semibold text-(--gray-11)"
          onClick={() => setDescriptionOpen((prev) => !prev)}
        >
          <span>Description</span>
          {isDescriptionOpen ? (
            <ChevronDown size="1rem" className="text-(--gray-9)" />
          ) : (
            <ChevronRight size="1rem" className="text-(--gray-9)" />
          )}
        </button>
        {isDescriptionOpen && (
          <SimpleEditor
            initialValue={JSON.parse(material.payload.description)}
            readOnly
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <h6 className="text-sm font-semibold text-(--gray-11)">Submission</h6>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-(--gray-11)">
          <Clock size="0.875rem" />
          <span>Avg Time: {formatTime(payload.avg_wall_time)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-(--gray-11)">
          <HardDrive size="0.875rem" />
          <span>Avg Memory: {formatMemory(payload.avg_memory)}</span>
        </div>
        <span className="text-xs text-(--gray-9)">
          Submitted: {new Date(created_at).toLocaleString()}
        </span>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-6 p-3 bg-(--gray-3) rounded-lg">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-(--gray-11)">
            Auto Score:
          </Label>
          <span className="text-sm font-semibold text-(--gray-12)">
            {auto_score} / {maxAutoScore}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="manual-score"
            className="text-xs font-medium text-(--gray-11)"
          >
            Manual Score:
          </Label>
          <ManualScoreInput
            submissionID={payload.submission_id}
            manualScore={manual_score}
            maxScore={material.manual_score}
            sectionId={sectionId}
            labId={labId}
            materialId={materialId}
          />
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview files={payload.files} className="h-140" />

      {/* Test cases — reuse the student (core) Testcases section so both stay aligned */}
      <TestcaseTable
        isLoading={false}
        groups={payload.test_case_groups}
        showGroupScore
        instructorView
      />
    </div>
  );
}

export default CodeSubmissionDetail;
