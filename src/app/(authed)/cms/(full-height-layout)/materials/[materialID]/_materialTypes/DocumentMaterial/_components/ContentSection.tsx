"use client";

import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { useAtom, useAtomValue } from "jotai";
import { contentAtom } from "../_stores/content.store";
import { cmsMaterialService } from "~/services/cms-material.service";
import { useParams } from "next/navigation";
import { isLoadingAtom } from "../_stores/loading.store";
import { isOwnerAtom } from "../_stores/owner.store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function ContentSection() {
  const isLoading = useAtomValue(isLoadingAtom);
  const [content, setContent] = useAtom(contentAtom);
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
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
        courseID,
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
    <div className="flex-1 max-h-full overflow-auto">
      <SimpleEditor
        onChange={setContent}
        readOnly={!isOwner}
        isLoading={isLoading}
        initialValue={content}
        onUploadImage={handleImageUpload}
        maxFileUploadSize={MAX_FILE_SIZE}
        className="p-4 max-w-4xl mx-auto"
      />
    </div>
  );
}

export default ContentSection;
