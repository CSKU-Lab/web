"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button as UIButton } from "~/components/ui/button";
import type { InputEmbedMode } from "~/components/tiptap-node/input-embed-node/input-embed-node-extension";

export interface InputEmbedFormValues {
  label: string;
  mode: InputEmbedMode;
  pattern: string;
  score: number;
  caseInsensitive: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  initial?: Partial<InputEmbedFormValues>;
  onSubmit: (values: InputEmbedFormValues) => void;
}

export function InputEmbedDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  initial,
  onSubmit,
}: Props) {
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<InputEmbedMode>("exact");
  const [pattern, setPattern] = useState("");
  const [score, setScore] = useState("0");
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  // Seed the form from `initial` each time the dialog opens so an edit starts
  // from the node's current config and a fresh insert starts from defaults.
  useEffect(() => {
    if (!open) return;
    setLabel(initial?.label ?? "");
    setMode(initial?.mode ?? "exact");
    setPattern(initial?.pattern ?? "");
    setScore(String(initial?.score ?? 0));
    setCaseInsensitive(initial?.caseInsensitive ?? false);
  }, [open, initial]);

  const handleSubmit = () => {
    onSubmit({
      label,
      mode,
      // Manual inputs are graded by hand, so no answer/pattern is stored.
      pattern: mode === "manual" ? "" : pattern,
      score: Number(score) || 0,
      caseInsensitive: mode === "regex" ? caseInsensitive : false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="input-embed-label">Label</Label>
            <Input
              id="input-embed-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Question prompt"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-embed-mode">Scoring mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as InputEmbedMode)}
            >
              <SelectTrigger id="input-embed-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact match (auto)</SelectItem>
                <SelectItem value="regex">Regex (auto)</SelectItem>
                <SelectItem value="manual">Manual grading</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-(--gray-10)">
              Changing mode or pattern rescores existing submissions when you run
              Regrade All from the submissions list.
            </p>
          </div>

          {mode !== "manual" && (
            <div className="space-y-1.5">
              <Label htmlFor="input-embed-pattern">
                {mode === "exact" ? "Expected value" : "Regex pattern"}
              </Label>
              <Input
                id="input-embed-pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder={mode === "exact" ? "answer" : "^answer$"}
                className="font-mono"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="input-embed-score">Score</Label>
            <Input
              id="input-embed-score"
              type="number"
              min={0}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          {mode === "regex" && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="input-embed-ci"
                checked={caseInsensitive}
                onCheckedChange={(checked) =>
                  setCaseInsensitive(checked === true)
                }
              />
              <Label htmlFor="input-embed-ci">Case insensitive</Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <UIButton type="button" onClick={handleSubmit}>
            {submitLabel}
          </UIButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
