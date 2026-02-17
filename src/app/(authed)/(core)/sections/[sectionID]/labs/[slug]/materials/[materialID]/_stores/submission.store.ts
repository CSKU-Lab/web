"use client";

import { atom } from "jotai";
import type { CodeFile } from "~/types/code-material";
import type { StatusType } from "../_components/DetailSection/renderStatus";
import type { Runner } from "~/components/Editor/types/runner";

export const submissionFilesAtom = atom<CodeFile[]>([
  {
    name: "main.py",
    content: "# Write your code here\nprint('Hello, World!')\n",
  },
]);

export const selectedRunnerAtom = atom<Runner | null>(null);
export const submissionStatusAtom = atom<StatusType>("NO_SUBMISSION");

// Track submission IDs that should have active EventSource connections
export const activeSubmissionsAtom = atom<Set<string>>(new Set<string>());
