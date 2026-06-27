import { useMemo } from "react";
import { Code2 } from "lucide-react";
import type { SubmissionRendererProps } from "~/features/cms/submissions/configs/submission-renderers";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
}

function extractEmbeds(nodes: TiptapNode[]): Array<{
  materialID: string;
  title: string;
  autoScore: number;
}> {
  const result: Array<{ materialID: string; title: string; autoScore: number }> = [];
  for (const node of nodes) {
    if (node.type === "codeMaterialEmbed" && node.attrs) {
      result.push({
        materialID: node.attrs.materialID as string,
        title: (node.attrs.title as string) || "Code Problem",
        autoScore: (node.attrs.autoScore as number) || 0,
      });
    }
    if (node.content) {
      result.push(...extractEmbeds(node.content));
    }
  }
  return result;
}

function DocumentSubmissionDetail({ material, payload: submissionPayload, auto_score, manual_score }: SubmissionRendererProps) {
  const embeds = useMemo(() => {
    const matPayload = material.payload as { content?: string } | undefined;
    if (!matPayload?.content) return [];
    try {
      const doc: TiptapNode = JSON.parse(matPayload.content);
      return extractEmbeds(doc.content ?? []);
    } catch {
      return [];
    }
  }, [material.payload]);

  const embedScores = useMemo(() => {
    const p = submissionPayload as { embed_scores?: Record<string, number> } | null;
    return p?.embed_scores ?? {};
  }, [submissionPayload]);

  const totalMaxScore = embeds.reduce((sum, e) => sum + e.autoScore, 0);

  if (embeds.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-(--gray-10)">
          No embedded code problems in this document.
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
