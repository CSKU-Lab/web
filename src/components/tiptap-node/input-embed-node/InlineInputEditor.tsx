"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { firePassConfetti } from "~/lib/confetti";
import { fireFailGlitch } from "~/lib/glitch";
import { inputEmbedService } from "~/services/input-embed.service";
import type { InputEmbedMode } from "~/components/tiptap-node/input-embed-node/input-embed-node-extension";
import { queryKeys } from "~/queryKeys";

interface Props {
  nodeID: string;
  label: string;
  mode: InputEmbedMode;
  score: number;
  sectionID: string;
  labID: string;
}

type SubmissionStatus = "idle" | "grading" | "passed" | "failed" | "pending";

export function InlineInputEditor({
  nodeID,
  label,
  mode,
  score: maxScore,
  sectionID,
  labID,
}: Props) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [score, setScore] = useState<number | null>(null);
  const isManual = mode === "manual";

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
      // Manual inputs stay pending until an instructor grades them (graded=true).
      if (isManual && !myResult.graded) {
        setStatus("pending");
        setScore(null);
      } else {
        setStatus(myResult.passed ? "passed" : "failed");
        setScore(myResult.score);
      }
    }
  }, [myResult, isManual]);

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
      if (isManual) {
        setStatus("pending");
        setScore(null);
      } else {
        setStatus(res.passed ? "passed" : "failed");
        setScore(res.score);
        if (res.passed) {
          firePassConfetti();
        } else {
          fireFailGlitch();
        }
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
        <span className="inline-flex items-center gap-1 text-xs text-(--yellow-11)">
          <Loader2 size="0.75rem" className="animate-spin" />
          {isManual ? "Submitting..." : "Grading..."}
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-(--blue-11)">
          <Clock size="0.75rem" />
          Pending review
        </span>
      );
    }
    if (status === "passed") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-(--grass-11)">
          <CheckCircle2 size="0.75rem" />
          Passed{score !== null ? ` · ${score} pts` : ""}
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-(--tomato-11)">
          <XCircle size="0.75rem" />
          Failed{score !== null ? ` · ${score} pts` : ""}
        </span>
      );
    }
    return null;
  };

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      {label && (
        <span className="text-sm text-(--gray-12)">{label}</span>
      )}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Answer..."
        className="inline-block h-7 w-40 px-2 py-1 text-sm"
      />
      <Button
        type="button"
        size="sm"
        onClick={handleSubmit}
        disabled={submitMutation.isPending || status === "grading"}
        className="h-7"
      >
        {submitMutation.isPending || status === "grading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Submit"
        )}
      </Button>
      {renderStatus()}
      {status === "idle" && (
        <span className="text-xs text-(--gray-10)">{maxScore} pts</span>
      )}
    </span>
  );
}
