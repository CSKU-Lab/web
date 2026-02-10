"use client";
import { GripVertical } from "lucide-react";
import useDrag from "~/hooks/useDrag";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { descriptionAtom, editorAtom } from "../_stores/description.store";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { isLoadingAtom } from "../_stores/loading.store";
import { isOwnerAtom } from "../_stores/owner.store";
import { useEffect } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function DescriptionSection() {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 500,
    direction: "horizontal",
  });

  const isLoading = useAtomValue(isLoadingAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const { materialID } = useParams<{ materialID: string }>();
  const isOwner = useAtomValue(isOwnerAtom);

  const handleImageUpload = async (
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal,
  ): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`,
      );
    }

    try {
      const res = await cmsMaterialService.uploadAsset(
        materialID,
        file,
        (progressEvent) => {
          if (abortSignal?.aborted) {
            throw new Error("Upload cancelled");
          }

          onProgress?.({ progress: progressEvent.progress ?? 0 });
        },
        abortSignal,
      );

      return res.data.url;
    } catch {
      throw new Error("Something went wrong during upload");
    }
  };
  return (
    <div
      className="flex flex-col min-h-0 border border-t-0 border-l-0 2xl:border-l relative min-w-[300px]"
      style={{ width: size }}
      ref={containerRef}
    >
      <button
        {...events}
        ref={buttonRef}
        className="w-4 h-8 bg-white border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center"
      >
        <GripVertical size="0.9rem" />
      </button>
      <div className="border-b p-4">
        <h4 className="text-xs text-(--gray-11)">Description</h4>
      </div>
      <div className="flex-1 max-h-full overflow-auto">
        <SimpleEditor
          onChange={setDescription}
          readOnly={!isOwner}
          isLoading={isLoading}
          initialValue={description}
          onUploadImage={handleImageUpload}
          maxFileUploadSize={MAX_FILE_SIZE}
          className="p-4"
        />
      </div>
    </div>
  );
}

export default DescriptionSection;
