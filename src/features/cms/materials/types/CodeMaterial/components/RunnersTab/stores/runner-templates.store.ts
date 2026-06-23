import { atom } from "jotai";
import type { RunnerTemplate } from "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/types/runner-template";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";

const internalRunnerTemplatesAtom = atom<RunnerTemplate[]>([]);

/**
 * Tracks whether runner templates have been modified since they were last
 * loaded from the server. Used by the Solution tab to show a reload banner.
 */
export const runnerChangedSinceLoadAtom = atom<boolean>(false);

export const initialRunnerTemplatesAtom = atom(
  null,
  (_get, set, runnerTemplates: RunnerTemplate[]) => {
    set(internalRunnerTemplatesAtom, runnerTemplates);
    // Reset the changed flag whenever templates are loaded from server
    set(runnerChangedSinceLoadAtom, false);
  },
);

export const runnerTemplatesAtom = atom(
  (get) => get(internalRunnerTemplatesAtom),
  (get, set, newRunnerTemplates: RunnerTemplate[]) => {
    const currentRunnerTemplates = get(internalRunnerTemplatesAtom);
    if (
      JSON.stringify(currentRunnerTemplates) ===
      JSON.stringify(newRunnerTemplates)
    ) {
      return;
    }

    set(internalRunnerTemplatesAtom, newRunnerTemplates);
    set(runnerChangedSinceLoadAtom, true);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

export const addRunnerTemplateAtom = atom(
  null,
  (get, set, runnerTemplate: RunnerTemplate) => {
    const currentRunnerTemplates = get(internalRunnerTemplatesAtom);
    set(internalRunnerTemplatesAtom, [...currentRunnerTemplates, runnerTemplate]);
    set(runnerChangedSinceLoadAtom, true);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

export const removeRunnerTemplateAtom = atom(
  null,
  (get, set, runnerTemplateId: string) => {
    const currentRunnerTemplates = get(internalRunnerTemplatesAtom);
    set(
      internalRunnerTemplatesAtom,
      currentRunnerTemplates.filter((rt) => rt.id !== runnerTemplateId),
    );
    set(runnerChangedSinceLoadAtom, true);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);

export const updateRunnerTemplateAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<RunnerTemplate> }) => {
    const currentRunnerTemplates = get(internalRunnerTemplatesAtom);
    set(
      internalRunnerTemplatesAtom,
      currentRunnerTemplates.map((rt) =>
        rt.id === id ? { ...rt, ...updates } : rt,
      ),
    );
    set(runnerChangedSinceLoadAtom, true);
    const isOwner = get(isOwnerAtom);
    if (isOwner) {
      set(saveStatusAtom, "UnSaved");
    }
  },
);
