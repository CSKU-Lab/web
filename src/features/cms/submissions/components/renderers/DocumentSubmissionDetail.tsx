import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import type { SubmissionRendererProps } from "~/features/cms/submissions/configs/submission-renderers";
import { selectedStudentAtom } from "~/features/cms/submissions/stores/selected-student.store";
import { selectedSubmissionAtom } from "~/features/cms/submissions/stores/selected-submission.store";
import type { CMSSectionStudentLatestSubmission } from "~/types/cms-section-submission";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";

function DocumentSubmissionDetail({
  material,
  auto_score,
  manual_score,
}: SubmissionRendererProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectionID = params.sectionID as string;
  const labID = params.labID as string;
  const selectedStudent = useAtomValue(selectedStudentAtom);
  const selectedSubmission = useAtomValue(selectedSubmissionAtom) as
    | CMSSectionStudentLatestSubmission
    | null;

  // studentID source varies by how the panel was opened:
  //  - normal list view: the selected submission carries `.student`
  //  - fuzzy search: selectedStudentAtom
  //  - view-all mode: the `student_id` URL param
  const studentID =
    selectedSubmission?.student?.id ??
    selectedStudent?.id ??
    searchParams.get("student_id") ??
    null;

  const content = useMemo(() => {
    const matPayload = material.payload as { content?: string } | undefined;
    if (!matPayload?.content) return null;
    try {
      return JSON.parse(matPayload.content);
    } catch {
      return null;
    }
  }, [material.payload]);

  const review = studentID ? { sectionID, labID, studentID } : null;

  return (
    <div className="p-4 space-y-4">
      {/* Score summary — per-embed scores render inline within the document. */}
      <div className="flex items-center gap-4 p-3 bg-(--gray-3) rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-(--gray-11)">
            Auto Score:
          </span>
          <span className="text-sm font-semibold text-(--gray-12)">
            {auto_score} / {material.auto_score}
          </span>
        </div>
        {material.manual_score > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-(--gray-11)">
              Manual Score:
            </span>
            <span className="text-sm font-semibold text-(--gray-12)">
              {manual_score} / {material.manual_score}
            </span>
          </div>
        )}
      </div>

      {/* Full document rendered like the student view, including code/input
          embeds that show the selected student's submitted content. */}
      {content ? (
        <SimpleEditor
          key={studentID ?? "no-student"}
          readOnly
          initialValue={content}
          review={review}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-(--gray-10)">
          <FileText size="1.5rem" />
          <span className="text-sm">No document content.</span>
        </div>
      )}
    </div>
  );
}

export default DocumentSubmissionDetail;
