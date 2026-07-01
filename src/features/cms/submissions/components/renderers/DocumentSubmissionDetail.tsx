import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Code2, FormInput, CheckCircle2, XCircle } from "lucide-react";
import type { SubmissionRendererProps } from "~/features/cms/submissions/configs/submission-renderers";
import { cmsMaterialService } from "~/services/cms-material.service";
import { selectedStudentAtom } from "~/features/cms/submissions/stores/selected-student.store";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
}

interface CodeEmbed {
  materialID: string;
  title: string;
  autoScore: number;
}

interface InputEmbed {
  nodeID: string;
  label: string;
  score: number;
}

function extractEmbeds(nodes: TiptapNode[]): {
  code: CodeEmbed[];
  input: InputEmbed[];
} {
  const code: CodeEmbed[] = [];
  const input: InputEmbed[] = [];
  const walk = (list: TiptapNode[]) => {
    for (const node of list) {
      if (node.type === "codeMaterialEmbed" && node.attrs) {
        code.push({
          materialID: node.attrs.materialID as string,
          title: (node.attrs.title as string) || "Code Problem",
          autoScore: (node.attrs.autoScore as number) || 0,
        });
      }
      if (node.type === "inputEmbed" && node.attrs) {
        input.push({
          nodeID: node.attrs.nodeID as string,
          label: (node.attrs.label as string) || "Input Field",
          score: (node.attrs.score as number) || 0,
        });
      }
      if (node.content) {
        walk(node.content);
      }
    }
  };
  walk(nodes);
  return { code, input };
}

function DocumentSubmissionDetail({ material, payload: submissionPayload, auto_score, manual_score }: SubmissionRendererProps) {
  const params = useParams();
  const courseID = params.courseID as string;
  const selectedStudent = useAtomValue(selectedStudentAtom);

  const { code: embeds, input: inputEmbeds } = useMemo(() => {
    const matPayload = material.payload as { content?: string } | undefined;
    if (!matPayload?.content) return { code: [], input: [] };
    try {
      const doc: TiptapNode = JSON.parse(matPayload.content);
      return extractEmbeds(doc.content ?? []);
    } catch {
      return { code: [], input: [] };
    }
  }, [material.payload]);

  const { data: inputSubmissions } = useQuery({
    queryKey: ["cms-input-submissions", courseID, material.id],
    queryFn: () => cmsMaterialService.getInputSubmissions(courseID, material.id),
    enabled: !!courseID && !!material.id && inputEmbeds.length > 0,
  });

  // Latest result per node for the currently selected student.
  const inputResultByNode = useMemo(() => {
    const map = new Map<
      string,
      { value: string; passed: boolean; score: number }
    >();
    if (!inputSubmissions || !selectedStudent) return map;
    for (const sub of inputSubmissions) {
      if (sub.user_id !== selectedStudent.id) continue;
      map.set(sub.node_id, {
        value: sub.value,
        passed: sub.passed,
        score: sub.score,
      });
    }
    return map;
  }, [inputSubmissions, selectedStudent]);

  const embedScores = useMemo(() => {
    const p = submissionPayload as { embed_scores?: Record<string, number> } | null;
    return p?.embed_scores ?? {};
  }, [submissionPayload]);

  const totalMaxScore =
    embeds.reduce((sum, e) => sum + e.autoScore, 0) +
    inputEmbeds.reduce((sum, e) => sum + e.score, 0);

  if (embeds.length === 0 && inputEmbeds.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-(--gray-10)">
          No embedded problems in this document.
        </p>
        <div className="flex items-center gap-4 p-3 bg-(--gray-3) rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-(--gray-11)">Auto Score:</span>
            <span className="text-sm font-semibold text-(--gray-12)">
              {auto_score} / {material.auto_score}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-(--gray-11)">Manual Score:</span>
            <span className="text-sm font-semibold text-(--gray-12)">
              {manual_score} / {material.manual_score}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h6 className="text-sm font-semibold text-(--gray-11)">Score Breakdown</h6>

      <div className="space-y-2">
        {embeds.map((embed) => {
          const studentScore = embedScores[embed.materialID];
          const scoreLabel = studentScore !== undefined ? String(studentScore) : "—";
          return (
            <div
              key={embed.materialID}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md bg-(--gray-2)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Code2 size="0.875rem" className="text-(--gray-10) shrink-0" />
                <span className="text-sm text-(--gray-12) truncate">{embed.title}</span>
              </div>
              <span className="text-sm font-medium text-(--gray-11) shrink-0">
                {scoreLabel} / {embed.autoScore} pts
              </span>
            </div>
          );
        })}

        {inputEmbeds.map((embed) => {
          const result = inputResultByNode.get(embed.nodeID);
          const scoreLabel = result ? String(result.score) : "—";
          return (
            <div
              key={embed.nodeID}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md bg-(--gray-2)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FormInput size="0.875rem" className="text-(--gray-10) shrink-0" />
                <span className="text-sm text-(--gray-12) truncate">
                  {embed.label}
                </span>
                {result && (
                  <>
                    <code className="text-xs font-mono text-(--gray-11) truncate max-w-[12rem]">
                      {result.value || "(empty)"}
                    </code>
                    {result.passed ? (
                      <CheckCircle2 size="0.875rem" className="text-(--grass-11) shrink-0" />
                    ) : (
                      <XCircle size="0.875rem" className="text-(--tomato-11) shrink-0" />
                    )}
                  </>
                )}
              </div>
              <span className="text-sm font-medium text-(--gray-11) shrink-0">
                {scoreLabel} / {embed.score} pts
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-3 py-2.5 rounded-md bg-(--gray-3) font-medium">
        <span className="text-sm text-(--gray-12)">Total Auto Score</span>
        <span className="text-sm text-(--gray-12)">
          {auto_score} / {totalMaxScore}
        </span>
      </div>

      {material.manual_score > 0 && (
        <div className="flex items-center gap-4 p-3 bg-(--gray-3) rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-(--gray-11)">Manual Score:</span>
            <span className="text-sm font-semibold text-(--gray-12)">
              {manual_score} / {material.manual_score}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentSubmissionDetail;
