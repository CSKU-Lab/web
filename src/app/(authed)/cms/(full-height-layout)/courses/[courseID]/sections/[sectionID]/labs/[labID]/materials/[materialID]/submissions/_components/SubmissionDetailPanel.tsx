import { useAtomValue } from "jotai";
import type { CMSMaterial } from "~/types/cms-material";
import EmptyDetailState from "./EmptyDetailState";
import { getSubmissionRenderer } from "../_configs/submission-renderers";
import { selectedSubmissionAtom } from "../_stores/selected-submission.store";

interface SubmissionDetailPanelProps {
  material: CMSMaterial;
}

function SubmissionDetailPanel({ material }: SubmissionDetailPanelProps) {
  const Renderer = getSubmissionRenderer(material.type);

  const selectedSubmission = useAtomValue(selectedSubmissionAtom);

  if (!selectedSubmission) {
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
        key={selectedSubmission.id}
        material={material}
        created_at={selectedSubmission.created_at}
        payload={selectedSubmission.payload}
        auto_score={selectedSubmission.auto_score}
        manual_score={selectedSubmission.manual_score}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-auto">{render()}</div>
    </div>
  );
}

export default SubmissionDetailPanel;
