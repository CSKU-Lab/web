"use client";

import { atom } from "jotai";
import type { CodeFile } from "~/types/code-material";
import type { StatusType } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import type { Runner } from "~/components/Editor/types/runner";
import type { TemplateFile } from "~/components/Editor/types/editor";

export const submissionFilesAtom = atom<CodeFile[]>([]);

// Original segment structure from the runner, used to build the submission payload.
export const submissionTemplateFilesAtom = atom<TemplateFile[]>([]);

export const selectedRunnerAtom = atom<Runner | null>(null);
export const submissionStatusAtom = atom<StatusType>("NO_SUBMISSION");

// Track submission IDs that should have active EventSource connections
export const activeSubmissionsAtom = atom<Set<string>>(new Set<string>());

export const activeLeftTabAtom = atom<"description" | "submissions" | "aiAssistant">("description");
