"use client";

import { useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import type { Editor } from "@tiptap/react";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import useMaterialSiblings from "~/features/core/materials/hooks/useMaterialSiblings";
import PageControl from "~/features/core/lessons/components/PageControl";
import DocumentToc from "~/features/core/materials/components/detail/DocumentToc";
import { extractHeadings } from "~/features/core/materials/utils/document-toc";
import { renderStatus } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import { mapSubmissionStatus } from "~/features/core/materials/components/detail/DetailSection/mapSubmissionStatus";
import { submissionStatusAtom } from "~/features/core/materials/stores/submission.store";
import { Skeleton } from "~/components/ui/skeleton";

function DocumentViewer() {
  const { data: material, isLoading } = useGetCoreMaterial();
  const { prevMaterial, nextMaterial } = useMaterialSiblings();
  const submissionStatus = useAtomValue(submissionStatusAtom);
  const [editor, setEditor] = useState<Editor | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use atom status if set (real-time), otherwise fallback to material API
  const displayStatus =
    submissionStatus !== "NO_SUBMISSION"
      ? submissionStatus
      : mapSubmissionStatus(material?.status);

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
        <header className="px-6 pt-8 pb-4 max-w-4xl mx-auto">
          {isLoading ? (
            <Skeleton className="h-9 w-2/3" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">
              {material?.name}
            </h1>
          )}
          {!isLoading && (
            <div className="mt-2 text-sm text-(--gray-11)">
              {renderStatus(displayStatus)}
            </div>
          )}
        </header>
        <SimpleEditor
          readOnly
          initialValue={content}
          isLoading={isLoading}
          onEditorReady={setEditor}
          className="px-6 pb-6 max-w-4xl mx-auto"
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
