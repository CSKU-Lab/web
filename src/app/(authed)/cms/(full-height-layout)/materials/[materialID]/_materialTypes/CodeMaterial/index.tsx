"use client";

import { useEffect } from "react";
import useGetMaterial from "../../_hooks/useGetMaterial";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection/index";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import { useSetAtom } from "jotai";
import { filesAtom, initialSolutionRunnerIDAtom } from "./_stores/editor.store";
import { initialTestCaseGroupsAtom } from "./_stores/testcase-groups.store";
import { initialDescriptionAtom } from "./_stores/description.store";
import type { CodeMaterialResponse } from "./_types/code-material-response";
import {
  initialAllowedRunnersAtom,
  initialCompareScriptAtom,
  initialLimitAtom,
} from "./_stores/config.store";
import { isLoadingAtom } from "./_stores/loading.store";
import { isOwnerAtom } from "./_stores/owner.store";

interface Props {
  isOwner: boolean;
}

function CodeMaterial({ isOwner }: Props) {
  const { data, isLoading } = useGetMaterial();
  const setDescription = useSetAtom(initialDescriptionAtom);
  const setTestCaseGroups = useSetAtom(initialTestCaseGroupsAtom);
  const setFiles = useSetAtom(filesAtom);
  const setSolutionRunnerID = useSetAtom(initialSolutionRunnerIDAtom);
  const setAllowedRunners = useSetAtom(initialAllowedRunnersAtom);
  const setCompareScript = useSetAtom(initialCompareScriptAtom);
  const setLimit = useSetAtom(initialLimitAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setIsOwner = useSetAtom(isOwnerAtom);

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
      setSolutionRunnerID(payload.solution_runner_id ?? "");

      if (payload.solution_files?.length) {
        setFiles(payload.solution_files);
      }

      setAllowedRunners(payload.allowed_runners);
      setCompareScript(payload.compare_script);
      setLimit(payload.limit);
    }
  }, [
    data,
    isLoading,
    setTestCaseGroups,
    setDescription,
    setFiles,
    setSolutionRunnerID,
    setAllowedRunners,
    setCompareScript,
    setLimit,
    setIsLoading,
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
