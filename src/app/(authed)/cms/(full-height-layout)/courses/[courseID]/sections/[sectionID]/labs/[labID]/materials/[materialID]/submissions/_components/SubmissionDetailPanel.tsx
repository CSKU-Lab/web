import { useMemo } from "react";
import { useAtom } from "jotai";
import type { CMSMaterial } from "~/types/cms-material";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import { selectedStudentIdAtom } from "../_stores/selected-student.store";
import EmptyDetailState from "./EmptyDetailState";
import { getSubmissionRenderer } from "../_configs/submission-renderers";

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
        <div className="flex-1">
          <EmptyDetailState />
        </div>
      </div>
    );
  }

  const render = () => {
    return (
      <Renderer
        material={material}
        created_at={selectedStudent.created_at}
        submission={selectedStudent.submission}
      />
    );
  };

  // Student hasn't submitted or submission is still processing
  if (!selectedStudent.submission) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <EmptyDetailState status={selectedStudent.submission_status} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-auto">{render()}</div>
    </div>
  );
}

export default SubmissionDetailPanel;
