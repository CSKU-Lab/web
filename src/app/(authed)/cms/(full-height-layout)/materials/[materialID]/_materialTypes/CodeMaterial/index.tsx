"use client";

import { useEffect } from "react";
import useGetMaterial from "../../_hooks/useGetMaterial";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import { useSetAtom } from "jotai";
import { initialCodeAtom, filesAtom, selectedFileAtom } from "./_stores/editor.store";
import { initialTestCasesAtom } from "./_stores/testcases.store";
import { initialDescriptionAtom } from "./_stores/description.store";

function CodeMaterial() {
  const { data, isFetching } = useGetMaterial();
  const setCode = useSetAtom(initialCodeAtom);
  const setDescription = useSetAtom(initialDescriptionAtom);
  const setTestCases = useSetAtom(initialTestCasesAtom);
  const setFiles = useSetAtom(filesAtom);
  const setSelectedFile = useSetAtom(selectedFileAtom);

  useEffect(() => {
    if (isFetching) return;
    if (data?.payload) {
      setDescription(JSON.parse(data.payload.description));
      setCode(data.payload.solution || "");
      setTestCases(data.payload.test_cases);

      if (data.payload.solution_files?.length) {
        setFiles(data.payload.solution_files);
        setSelectedFile(data.payload.solution_files[0].name);
      }

      // setConfig({
      //   allowedRunners: data.payload.allowed_runners || [],
      //   compareScript: data.payload.compare_script || null,
      // });
    }
  }, [data, isFetching, setCode, setTestCases, setDescription, setFiles, setSelectedFile]);

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
