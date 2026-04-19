import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import type { TypingMaterialPayload } from "~/types/typing-material";
import TypingPreviewClient from "./_components/TypingPreviewClient";

async function getTypingText(materialID: string): Promise<string> {
  try {
    const material = await cmsMaterialService.getById(materialID);
    if (material.type !== "typing") notFound();
    const payload = material.payload as TypingMaterialPayload;
    return payload.content ?? "";
  } catch {
    notFound();
  }
}

export default async function TypingPreviewPage(props: {
  params: Promise<{ materialID: string }>;
}) {
  const { materialID } = await props.params;
  const text = await getTypingText(materialID);

  return (
    <div className="h-screen flex flex-col bg-(--gray-1)">
      <div className="border-b border-(--gray-4) px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-(--gray-11)">Preview</span>
        <a
          href={`/cms/materials/${materialID}`}
          className="text-xs text-(--gray-10) hover:text-(--gray-12) transition-colors"
        >
          ← Back to editor
        </a>
      </div>
      <TypingPreviewClient text={text} />
    </div>
  );
}
