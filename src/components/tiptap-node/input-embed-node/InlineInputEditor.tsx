"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { firePassConfetti } from "~/lib/confetti";
import { fireFailGlitch } from "~/lib/glitch";
import { inputEmbedService } from "~/services/input-embed.service";
import { queryKeys } from "~/queryKeys";

interface Props {
  nodeID: string;
  label: string;
  score: number;
  sectionID: string;
  labID: string;
}

type SubmissionStatus = "idle" | "grading" | "passed" | "failed";

export function InlineInputEditor({
  nodeID,
  label,
  score: maxScore,
  sectionID,
  labID,
}: Props) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [score, setScore] = useState<number | null>(null);

  // The page route is the parent DOCUMENT material; its query drives the
  // document-level status pill, which aggregates these embeds server-side.
  const params = useParams();
  const documentMaterialID = params.materialID as string;

  // Hydrate from server only once per mount, and never clobber a fresh
  // submission made while the hydration fetch was in flight.
  const statusRef = useRef<SubmissionStatus>("idle");
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  const hydratedRef = useRef(false);

  const { data: myResult } = useQuery({
    queryKey: [
      "inline-input-result",
      nodeID,
      documentMaterialID,
      sectionID,
      labID,
    ],
    queryFn: () =>
      inputEmbedService.getMyResult({
        nodeID,
        documentMaterialID,
        labID,
        sectionID,
      }),
    enabled: !!nodeID && !!documentMaterialID && !!sectionID && !!labID,
  });

  useEffect(() => {
    if (hydratedRef.current) return;
    if (!myResult) return;
    hydratedRef.current = true;
    if (statusRef.current !== "idle") return;
    if (myResult.submitted) {
      setValue(myResult.value);
      setStatus(myResult.passed ? "passed" : "failed");
      setScore(myResult.score);
    }
  }, [myResult]);

  const submitMutation = useMutation({
    mutationFn: () =>
      inputEmbedService.submit({
        nodeID,
        value,
        documentMaterialID,
        labID,
        sectionID,
      }),
    onMutate: () => {
      setStatus("grading");
      setScore(null);
    },
    onSuccess: (res) => {
      setStatus(res.passed ? "passed" : "failed");
      setScore(res.score);
      if (res.passed) {
        firePassConfetti();
      } else {
        fireFailGlitch();
      }
      // Refresh the parent document's status pill, which aggregates the latest
      // status of every embedded block server-side.
      queryClient.invalidateQueries({
        queryKey: queryKeys.core.material.getById(documentMaterialID),
      });
    },
    onError: () => {
      setStatus("failed");
      toast.error("Submission failed");
    },
  });

  const handleSubmit = () => {
    if (!value.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    submitMutation.mutate();
  };

  const renderStatus = () => {
    if (status === "grading") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--yellow-11)">
          <Loader2 size="0.75rem" className="animate-spin" />
          <span>Grading...</span>
        </div>
      );
    }
    if (status === "passed") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--grass-11)">
          <CheckCircle2 size="0.75rem" />
          <span>Passed{score !== null ? ` · ${score} pts` : ""}</span>
        </div>
      );
    }
    if (status === "failed") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-(--tomato-11)">
          <XCircle size="0.75rem" />
          <span>Failed{score !== null ? ` · ${score} pts` : ""}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-lg my-4 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-(--gray-12)">
          {label || "Input"}
        </span>
        <div className="flex items-center gap-3">
          {renderStatus()}
          <span className="text-xs text-(--gray-10)">{maxScore} pts</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Your answer..."
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitMutation.isPending || status === "grading"}
        >
          {submitMutation.isPending || status === "grading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
