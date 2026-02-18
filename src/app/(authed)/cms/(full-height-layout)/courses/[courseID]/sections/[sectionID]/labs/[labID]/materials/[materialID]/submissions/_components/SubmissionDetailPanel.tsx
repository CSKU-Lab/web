import { useMemo } from "react";
import { useAtom } from "jotai";
import type { CMSMaterial } from "~/types/cms-material";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import { selectedStudentIdAtom } from "../_stores/selected-student.store";
import { getSubmissionRenderer } from "../_configs/submission-renderers";
import MaterialHeader from "./MaterialHeader";
import EmptyDetailState from "./EmptyDetailState";

interface SubmissionDetailPanelProps {
  material: CMSMaterial;
  students: CMSSectionStudentSubmission[];
}

function SubmissionDetailPanel({
  material,
  students,
}: SubmissionDetailPanelProps) {
  const [selectedId] = useAtom(selectedStudentIdAtom);

  const selectedStudent = useMemo(
    () => students.find((s) => s.student.id === selectedId) ?? null,
    [students, selectedId],
  );

  const Renderer = getSubmissionRenderer(material.type);

  // No student selected
  if (!selectedStudent) {
    return (
      <div className="flex flex-col h-full">
        <MaterialHeader material={material} />
        <div className="flex-1">
          <EmptyDetailState />
        </div>
      </div>
    );
  }

  // Student hasn't submitted or submission is still processing
  if (!selectedStudent.submission) {
    return (
      <div className="flex flex-col h-full">
        <MaterialHeader material={material} />
        <div className="flex-1">
          <EmptyDetailState status={selectedStudent.submission_status} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MaterialHeader material={material} />
      <div className="flex-1 min-h-0 overflow-auto">
        <Renderer submission={selectedStudent.submission} />
      </div>
    </div>
  );
}

export default SubmissionDetailPanel;
