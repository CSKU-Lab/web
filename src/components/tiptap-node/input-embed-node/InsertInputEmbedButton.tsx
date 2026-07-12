"use client";

import { useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { FormInput } from "lucide-react";
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
import { Button } from "~/components/tiptap-ui-primitive/button";
import type { InputEmbedMode } from "~/components/tiptap-node/input-embed-node/input-embed-node-extension";

interface Props {
  courseID: string;
}

// `courseID` is unused but kept to match EmbedCodeMaterialButton's signature
// (both are rendered the same way under the courseID guard in simple-editor).
export function InsertInputEmbedButton(_props: Props) {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<InputEmbedMode>("exact");
  const [pattern, setPattern] = useState("");
  const [score, setScore] = useState("0");
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const reset = () => {
    setLabel("");
    setMode("exact");
    setPattern("");
    setScore("0");
    setCaseInsensitive(false);
  };

  const handleInsert = () => {
    if (!editor) return;
    editor.commands.insertInputEmbed({
      nodeID: crypto.randomUUID(),
      label,
      mode,
      // Manual inputs are graded by hand, so no answer/pattern is stored.
      pattern: mode === "manual" ? "" : pattern,
      score: Number(score) || 0,
      caseInsensitive: mode === "regex" ? caseInsensitive : false,
    });
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        data-style="ghost"
        onClick={() => setOpen(true)}
        title="Insert Input Field"
        type="button"
      >
        <FormInput className="tiptap-button-icon" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Input Field</DialogTitle>
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
            <UIButton type="button" onClick={handleInsert}>
              Insert
            </UIButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
