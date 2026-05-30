"use client";

import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";

function DocumentViewer() {
  const { data: material, isLoading } = useGetCoreMaterial();

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
    <div className="flex-1 overflow-auto">
      <SimpleEditor
        readOnly
        initialValue={getContent()}
        isLoading={isLoading}
        className="p-6 max-w-4xl mx-auto"
      />
    </div>
  );
}

export default DocumentViewer;
