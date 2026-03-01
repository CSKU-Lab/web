"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { Server, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Button } from "~/components/commons/Button";
import { cn } from "~/lib/utils";
import { removeRunnerTemplateAtom, updateRunnerTemplateAtom } from "../_stores/runner-templates.store";
import type { RunnerTemplate } from "../_types/runner-template";
import type { CodeFile } from "~/components/Editor/types/editor";
import RunnerEditor from "./RunnerEditor";

interface RunnerTemplateCardProps {
  runnerTemplate: RunnerTemplate;
  disabled?: boolean;
}

function RunnerTemplateCard({ runnerTemplate, disabled }: RunnerTemplateCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const removeRunnerTemplate = useSetAtom(removeRunnerTemplateAtom);
  const updateRunnerTemplate = useSetAtom(updateRunnerTemplateAtom);

  const handleInitialFilesChange = (files: CodeFile[]) => {
    updateRunnerTemplate({
      id: runnerTemplate.id,
      updates: { initialFiles: files },
    });
  };

  const handleRemove = () => {
    removeRunnerTemplate(runnerTemplate.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-(--gray-2) cursor-pointer",
          "hover:bg-(--gray-3) transition-colors"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown size="1rem" className="text-(--gray-10)" />
        ) : (
          <ChevronRight size="1rem" className="text-(--gray-10)" />
        )}
        <Server size="1rem" className="text-(--accent-color)" />
        <span className="font-medium text-sm flex-1">{runnerTemplate.name}</span>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <button
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              className="p-1 hover:bg-(--gray-4) rounded text-(--gray-10) hover:text-(--red-10) transition-colors"
            >
              <Trash2 size="1rem" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="p-4">
              <DialogTitle>Remove Runner</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-(--gray-12)">
                Are you sure you want to remove{" "}
                <span className="font-medium">{runnerTemplate.name}</span>?
              </p>
            </div>
            <DialogFooter className="p-4">
              <Button
                className="px-6"
                variant="primary"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-6"
                variant="action"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isExpanded && (
        <div className="border-t h-96">
          <RunnerEditor
            buildScript={runnerTemplate.buildScript}
            runScript={runnerTemplate.runScript}
            initialFiles={runnerTemplate.initialFiles}
            onInitialFilesChange={handleInitialFilesChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export default RunnerTemplateCard;
