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
import { Button as UIButton } from "~/components/ui/button";
import { Button } from "~/components/tiptap-ui-primitive/button";

interface Props {
  courseID: string;
}

// `courseID` is unused but kept to match EmbedCodeMaterialButton's signature
// (both are rendered the same way under the courseID guard in simple-editor).
export function InsertInputEmbedButton(_props: Props) {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [pattern, setPattern] = useState("");
  const [score, setScore] = useState("0");
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const reset = () => {
    setLabel("");
    setPattern("");
    setScore("0");
    setCaseInsensitive(false);
  };

  const handleInsert = () => {
    if (!editor) return;
    editor.commands.insertInputEmbed({
      nodeID: crypto.randomUUID(),
      label,
      pattern,
      score: Number(score) || 0,
      caseInsensitive,
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
              <Label htmlFor="input-embed-pattern">Pattern (regex)</Label>
              <Input
                id="input-embed-pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="^answer$"
                className="font-mono"
              />
            </div>

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
