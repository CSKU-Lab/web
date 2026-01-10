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
  solutionRunnerIDAtom,
} from "./_stores/editor.store";
import { initialTestCasesAtom } from "./_stores/testcases.store";
import { initialDescriptionAtom } from "./_stores/description.store";
import type { CodeMaterialResponse } from "./_types/code-material-response";

function CodeMaterial() {
  const { data, isFetching } = useGetMaterial();
  const setCode = useSetAtom(initialCodeAtom);
  const setDescription = useSetAtom(initialDescriptionAtom);
  const setTestCases = useSetAtom(initialTestCasesAtom);
  const setFiles = useSetAtom(filesAtom);
  const setSelectedFile = useSetAtom(selectedFileAtom);
  const setSolutionRunnerID = useSetAtom(solutionRunnerIDAtom);

  useEffect(() => {
    if (isFetching) return;
    const payload = data?.payload as CodeMaterialResponse | undefined;
    if (payload !== undefined) {
      setDescription(JSON.parse(payload.description));
      setTestCases(payload.test_cases);
      setSolutionRunnerID(payload.solution_runner_id || "");

      if (payload.solution_files?.length) {
        setFiles(payload.solution_files);
        setSelectedFile(payload.solution_files[0].name);
      }

      // setConfig({
      //   allowedRunners: data.payload.allowed_runners || [],
      //   compareScript: data.payload.compare_script || null,
      // });
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
