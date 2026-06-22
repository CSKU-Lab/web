"use client";

import { useEffect } from "react";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";
import DescriptionSection from "~/features/cms/materials/types/CodeMaterial/components/DescriptionSection";
import DetailSection from "~/features/cms/materials/types/CodeMaterial/components/DetailSection/index";
import MultipleTabsSection from "~/features/cms/materials/types/CodeMaterial/components/MultipleTabsSection";
import { useSetAtom } from "jotai";
import { initialSolutionAtom } from "~/features/cms/materials/types/CodeMaterial/stores/solution.store";
import { initialTestCaseGroupsAtom } from "~/features/cms/materials/types/CodeMaterial/stores/testcase-groups.store";
import { initialDescriptionAtom } from "~/features/cms/materials/types/CodeMaterial/stores/description.store";
import type { CodeMaterialResponse } from "~/features/cms/materials/types/CodeMaterial/types/code-material-response";
import {
  initialCompareScriptAtom,
  initialLimitAtom,
} from "~/features/cms/materials/types/CodeMaterial/stores/config.store";
import { isLoadingAtom } from "~/features/cms/materials/types/CodeMaterial/stores/loading.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import { initialResourceFilesAtom } from "~/features/cms/materials/types/CodeMaterial/stores/resource-files.store";
import { initialRunnerTemplatesAtom } from "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/stores/runner-templates.store";

interface Props {
  isOwner: boolean;
}

function CodeMaterial({ isOwner }: Props) {
  const { data, isLoading } = useGetMaterial();
  const setDescription = useSetAtom(initialDescriptionAtom);
  const setTestCaseGroups = useSetAtom(initialTestCaseGroupsAtom);
  const setSolution = useSetAtom(initialSolutionAtom);
  const setCompareScript = useSetAtom(initialCompareScriptAtom);
  const setLimit = useSetAtom(initialLimitAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setIsOwner = useSetAtom(isOwnerAtom);
  const setResourceFiles = useSetAtom(initialResourceFilesAtom);
  const setRunnerTemplates = useSetAtom(initialRunnerTemplatesAtom);

  useEffect(() => {
    setIsOwner(isOwner);
  }, [isOwner, setIsOwner]);

  useEffect(() => {
    setIsLoading(isLoading);
    if (isLoading) return;
    const payload = data?.payload as CodeMaterialResponse | undefined;
    if (payload !== undefined) {
      if (payload?.description !== null) {
        setDescription(JSON.parse(payload.description));
      }
      setTestCaseGroups(payload.test_case_groups);

      if (payload.solution) {
        setSolution({
          runner: { id: payload.solution.runner.id, name: payload.solution.runner.name },
          files: payload.solution.files ?? [],
        });
      }

      if (payload.resource_files?.length) {
        setResourceFiles(payload.resource_files);
      }

      setCompareScript(payload.compare_script);
      setLimit(
        payload.limits ?? {
          cpu_time: 0,
          cpu_extra_time: 0,
          wall_time: 0,
          memory: 0,
          stack: 0,
          max_open_files: 0,
          max_file_size: 0,
          network_allow: false,
        },
      );

      setRunnerTemplates(
        payload.allowed_runners.map((r) => ({
          id: r.id,
          name: r.name,
          buildScript: r.build_script,
          runScript: r.run_script,
          initialFiles: r.files.map((f) => ({
            name: f.name,
            segments: f.segments && f.segments.length > 0
              ? f.segments.map((s) => ({ content: s.content, type: s.type as import("~/components/Editor/types/editor").SegmentType }))
              : [{ content: f.content, type: "editable" as const }],
          })),
        })),
      );
    }
  }, [
    data,
    isLoading,
    setTestCaseGroups,
    setDescription,
    setSolution,
    setResourceFiles,
    setCompareScript,
    setLimit,
    setIsLoading,
    setRunnerTemplates,
  ]);

  return (
    <>
      <DetailSection />
      <div className="flex flex-1 min-h-0">
        <DescriptionSection />
        <MultipleTabsSection />
      </div>
    </>
  );
}

export default CodeMaterial;
