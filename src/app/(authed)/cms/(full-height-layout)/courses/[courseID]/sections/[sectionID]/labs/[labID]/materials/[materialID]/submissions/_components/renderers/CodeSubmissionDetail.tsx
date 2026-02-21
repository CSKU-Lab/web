import { useState, Fragment } from "react";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  HardDrive,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import CodePreview from "~/components/Editor/CodePreview";
import type { CodeSubmissionData } from "~/types/cms-section-submission";
import type { CodeSubmissionResultStatus } from "~/types/core-code-submission";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { CMSMaterial } from "~/types/cms-material";
import { useUpdateManualScore } from "../../_hooks/useUpdateManualScore";

interface CodeSubmissionDetailProps {
  material: CMSMaterial;
  created_at: string;
  payload: CodeSubmissionData;
  auto_score: number;
  manual_score: number;
}

const statusConfig: Record<
  CodeSubmissionResultStatus,
  { label: string; className: string }
> = {
  RUN_PASSED: { label: "Passed", className: "text-(--grass-11)" },
  RUN_FAILED: { label: "Failed", className: "text-(--tomato-11)" },
  COMPILE_FAILED: { label: "Compile Error", className: "text-(--tomato-11)" },
  GRADER_ERROR: { label: "Grader Error", className: "text-(--tomato-11)" },
  TIME_LIMIT_EXCEEDED: { label: "TLE", className: "text-(--yellow-11)" },
  MEMORY_LIMIT_EXCEEDED: { label: "MLE", className: "text-(--yellow-11)" },
  RUNTIME_ERROR: { label: "Runtime Error", className: "text-(--tomato-11)" },
  SIGNAL_ERROR: { label: "Signal Error", className: "text-(--tomato-11)" },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status as CodeSubmissionResultStatus] ?? {
      label: status,
      className: "text-(--gray-11)",
    }
  );
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

// Separate component for manual score input with key-based reset
interface ManualScoreInputProps {
  submissionID: string;
  manualScore: number;
  maxScore: number;
  sectionId: string;
  labId: string;
  materialId: string;
}

function ManualScoreInput({
  submissionID,
  manualScore,
  maxScore,
  sectionId,
  labId,
  materialId,
}: ManualScoreInputProps) {
  const [inputValue, setInputValue] = useState(String(manualScore ?? 0));

  const { mutate: updateManualScore, isPending: isSaving } =
    useUpdateManualScore({
      sectionId,
      labId,
      materialId,
    });

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value !== manualScore) {
      updateManualScore({
        submissionID,
        score: value,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        id="manual-score"
        type="number"
        min={0}
        max={maxScore}
        step={1}
        className="w-20 h-7 text-sm"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
      />
      <span className="text-sm text-(--gray-11)">/ {maxScore}</span>
      {isSaving && (
        <Loader2 size="0.875rem" className="animate-spin text-(--gray-9)" />
      )}
    </div>
  );
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

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isDescriptionOpen, setDescriptionOpen] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allResults =
    payload.test_case_groups?.flatMap((group) => group.results) ?? [];

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
            {auto_score} / {material.max_auto_score}
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
            maxScore={material.max_manual_score}
            sectionId={sectionId}
            labId={labId}
            materialId={materialId}
          />
        </div>
      </div>

      {/* Code Preview */}
      <CodePreview files={payload.files} className="h-140" />

      {/* Test Case Table */}
      {allResults.length > 0 && (
        <>
          <h6 className="text-sm font-semibold text-(--gray-11)">Test Cases</h6>
          <Table className="overflow-visible">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Time</TableHead>
                <TableHead className="w-[80px]">Memory</TableHead>
                <TableHead className="w-[32px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allResults.map((result, index) => {
                const statusInfo = getStatusConfig(result.status);
                const hasMessage =
                  result.status !== "RUN_PASSED" && !!result.message;
                const isExpanded = expandedRows.has(result.id);

                return (
                  <Fragment key={result.id}>
                    <TableRow
                      className={cn(hasMessage && "cursor-pointer")}
                      onClick={
                        hasMessage ? () => toggleRow(result.id) : undefined
                      }
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <textarea
                          value={result.input || "-"}
                          readOnly
                          disabled
                          className="w-full h-full min-h-[120px] p-2 resize-none font-mono text-sm border border-gray-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5"
                        />
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={result.output || "-"}
                          readOnly
                          disabled
                          className="w-full h-full min-h-[120px] p-2 resize-none font-mono text-sm border border-gray-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5"
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            statusInfo.className,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-(--gray-11)">
                        {formatTime(result.wall_time)}
                      </TableCell>
                      <TableCell className="text-xs text-(--gray-11)">
                        {formatMemory(result.memory)}
                      </TableCell>
                      <TableCell className="p-0">
                        {hasMessage &&
                          (isExpanded ? (
                            <ChevronDown
                              size="0.875rem"
                              className="text-(--gray-9)"
                            />
                          ) : (
                            <ChevronRight
                              size="0.875rem"
                              className="text-(--gray-9)"
                            />
                          ))}
                      </TableCell>
                    </TableRow>
                    {hasMessage && isExpanded && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-(--gray-3) p-3">
                          <pre className="text-xs text-(--gray-12) whitespace-pre-wrap font-mono">
                            {result.message}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export default CodeSubmissionDetail;
