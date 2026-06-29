"use client";

import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import useMaterialSiblings from "~/features/core/materials/hooks/useMaterialSiblings";
import PageControl from "~/features/core/lessons/components/PageControl";

function DocumentViewer() {
  const { data: material, isLoading } = useGetCoreMaterial();
  const { prevMaterial, nextMaterial } = useMaterialSiblings();

  const getContent = () => {
    if (isLoading) return null;
    try {
      const payload = material?.payload as { content?: string } | undefined;
      return JSON.parse(payload?.content ?? "");
    } catch {
      return null;
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <SimpleEditor
        readOnly
        initialValue={getContent()}
        isLoading={isLoading}
        className="p-6 max-w-4xl mx-auto"
      />
      {!isLoading && (prevMaterial || nextMaterial) && (
        <div className="px-6 max-w-4xl mx-auto">
          <PageControl prevPage={prevMaterial} nextPage={nextMaterial} />
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;
