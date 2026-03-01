"use client";

import { useState } from "react";
import { Server, Search, X } from "lucide-react";
import { useSetAtom } from "jotai";
import CodeMirror from "~/components/Editor/CodeMirror";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { Button } from "~/components/commons/Button";
import Input from "~/components/commons/Input";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { cmsRunnerService } from "~/services/cms-runner.service";
import { RunnerConfigDetail } from "~/types/cms-runner";
import { addRunnerTemplateAtom } from "../_stores/runner-templates.store";
import type { RunnerTemplate } from "../_types/runner-template";
import type { CodeFile } from "~/components/Editor/types/editor";
import useInputDebounce from "~/hooks/useInputDebounce";

interface RunnerSelectorProps {
  disabled?: boolean;
}

function RunnerSelector({ disabled }: RunnerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRunner, setSelectedRunner] = useState<RunnerConfigDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runners, setRunners] = useState<RunnerConfigDetail[]>([]);
  const debouncedSearch = useInputDebounce(search, 500);
  const addRunnerTemplate = useSetAtom(addRunnerTemplateAtom);

  const fetchRunners = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await cmsRunnerService.getPagination({
        params: { search: query, page: 1, page_size: 20 },
        includeScripts: true,
      });
      setRunners(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSearch("");
      setSelectedRunner(null);
      fetchRunners("");
    }
  };

  const handleSelectRunner = (runner: RunnerConfigDetail) => {
    setSelectedRunner(runner);
  };

  const handleConfirm = () => {
    if (!selectedRunner) return;

    const runnerTemplate: RunnerTemplate = {
      id: selectedRunner.id,
      name: selectedRunner.name,
      description: selectedRunner.description,
      buildScript: selectedRunner.build_script,
      runScript: selectedRunner.run_script,
      initialFiles: selectedRunner.initial_files.map((f): CodeFile => ({
        name: f.name,
        content: f.content,
      })),
    };
    addRunnerTemplate(runnerTemplate);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors",
            disabled
              ? "bg-(--gray-2) text-(--gray-8) cursor-not-allowed"
              : "bg-(--gray-2) text-(--gray-12) hover:bg-(--gray-3) border-(--gray-5)"
          )}
        >
          <Server size="1rem" />
          Add Runner
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Select Runner</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-4">
          <div className="relative mb-4">
            <Search size="1rem" className="absolute left-3 top-1/2 -translate-y-1/2 text-(--gray-10)" />
            <Input
              placeholder="Search runners..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : runners.length === 0 ? (
              <p className="text-center text-(--gray-10) py-8">No runners found</p>
            ) : (
              runners.map((runner) => (
                <div
                  key={runner.id}
                  onClick={() => handleSelectRunner(runner)}
                  className={cn(
                    "p-3 rounded-md border cursor-pointer transition-all",
                    selectedRunner?.id === runner.id
                      ? "border-(--accent-color) bg-(--accent-color)/5"
                      : "border-(--gray-5) hover:border-(--gray-6) hover:bg-(--gray-2)"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Server size="14" className="text-(--gray-10)" />
                    <h5 className="text-sm font-medium">{runner.name}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-(--gray-10)">Build Script:</span>
                      <CodeMirror
                        value={runner.build_script}
                        className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1"
                        readOnly
                      />
                    </div>
                    <div>
                      <span className="text-(--gray-10)">Run Script:</span>
                      <CodeMirror
                        value={runner.run_script}
                        className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="action"
            disabled={!selectedRunner}
            onClick={handleConfirm}
          >
            Add Runner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RunnerSelector;
