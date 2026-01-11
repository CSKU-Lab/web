"use client";

import { useEffect } from "react";
import useGetMaterial from "../../_hooks/useGetMaterial";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import { useSetAtom } from "jotai";
import {
  initialCodeAtom,
  filesAtom,
  selectedFileAtom,
  initialSolutionRunnerIDAtom,
} from "./_stores/editor.store";
import { initialTestCasesAtom } from "./_stores/testcases.store";
import { initialDescriptionAtom } from "./_stores/description.store";
import type { CodeMaterialResponse } from "./_types/code-material-response";
import {
  initialAllowedRunnersAtom,
  initialCompareScriptAtom,
  initialLimitAtom,
} from "./_stores/config.store";
import { isLoadingAtom } from "./_stores/loading.store";

function CodeMaterial() {
  const { data, isFetching } = useGetMaterial();
  const setCode = useSetAtom(initialCodeAtom);
  const setDescription = useSetAtom(initialDescriptionAtom);
  const setTestCases = useSetAtom(initialTestCasesAtom);
  const setFiles = useSetAtom(filesAtom);
  const setSelectedFile = useSetAtom(selectedFileAtom);
  const setSolutionRunnerID = useSetAtom(initialSolutionRunnerIDAtom);
  const setAllowedRunners = useSetAtom(initialAllowedRunnersAtom);
  const setCompareScript = useSetAtom(initialCompareScriptAtom);
  const setLimit = useSetAtom(initialLimitAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);

  useEffect(() => {
    setIsLoading(isFetching);
    if (isFetching) return;
    const payload = data?.payload as CodeMaterialResponse | undefined;
    if (payload !== undefined) {
      if (payload?.description !== null) {
        setDescription(JSON.parse(payload.description));
      }
      setTestCases(payload.test_cases);
      setSolutionRunnerID(payload.solution_runner_id ?? "");

      if (payload.solution_files?.length) {
        setFiles(payload.solution_files);
        setSelectedFile(payload.solution_files[0].name);
      }

      setAllowedRunners(payload.allowed_runners);
      setCompareScript(payload.compare_script);
      setLimit(payload.limit);
    }
  }, [
    data,
    isFetching,
    setCode,
    setTestCases,
    setDescription,
    setFiles,
    setSelectedFile,
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
