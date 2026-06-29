"use client";

import { useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import useMaterialSiblings from "~/features/core/materials/hooks/useMaterialSiblings";
import PageControl from "~/features/core/lessons/components/PageControl";
import DocumentToc from "~/features/core/materials/components/detail/DocumentToc";
import { extractHeadings } from "~/features/core/materials/utils/document-toc";

function DocumentViewer() {
  const { data: material, isLoading } = useGetCoreMaterial();
  const { prevMaterial, nextMaterial } = useMaterialSiblings();
  const [editor, setEditor] = useState<Editor | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const content = useMemo(() => {
    if (isLoading) return null;
    try {
      const payload = material?.payload as { content?: string } | undefined;
      return JSON.parse(payload?.content ?? "");
    } catch {
      return null;
    }
  }, [isLoading, material?.payload]);

  const headings = useMemo(() => extractHeadings(content), [content]);

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto flex">
      {!isLoading && (
        <DocumentToc
          headings={headings}
          editor={editor}
          scrollContainer={scrollRef}
        />
      )}
      <div className="flex-1 min-w-0">
        <SimpleEditor
          readOnly
          initialValue={content}
          isLoading={isLoading}
          onEditorReady={setEditor}
          className="p-6 max-w-4xl mx-auto"
        />
        {!isLoading && (prevMaterial || nextMaterial) && (
          <div className="px-6 max-w-4xl mx-auto">
            <PageControl prevPage={prevMaterial} nextPage={nextMaterial} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentViewer;
