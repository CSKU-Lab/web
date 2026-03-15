"use client";

import { useEffect } from "react";
import useGetMaterial from "../../_hooks/useGetMaterial";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection/index";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import { useSetAtom } from "jotai";
import { initialSolutionAtom } from "./_stores/solution.store";
import { initialTestCaseGroupsAtom } from "./_stores/testcase-groups.store";
import { initialDescriptionAtom } from "./_stores/description.store";
import type { CodeMaterialResponse } from "./_types/code-material-response";
import {
  initialCompareScriptAtom,
  initialLimitAtom,
} from "./_stores/config.store";
import { isLoadingAtom } from "./_stores/loading.store";
import { isOwnerAtom } from "./_stores/owner.store";
import { initialResourceFilesAtom } from "./_stores/resource-files.store";
import { initialRunnerTemplatesAtom } from "./_components/RunnersTab/_stores/runner-templates.store";

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
        payload.limit ?? {
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
          initialFiles: r.files,
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
