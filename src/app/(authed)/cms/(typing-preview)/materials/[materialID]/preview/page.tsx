import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import type { TypingMaterialPayload } from "~/types/typing-material";
import TypingPreviewClient from "~/features/cms/materials/components/preview/TypingPreviewClient";

async function getTypingText(
  courseID: string,
  materialID: string,
): Promise<string> {
  try {
    const material = await cmsMaterialService.getById(courseID, materialID);
    if (material.type !== "typing") notFound();
    const payload = material.payload as TypingMaterialPayload;
    return payload.content ?? "";
  } catch {
    notFound();
  }
}

export default async function TypingPreviewPage(props: {
  params: Promise<{ materialID: string }>;
  searchParams: Promise<{ course_id?: string }>;
}) {
  const { materialID } = await props.params;
  const { course_id: courseID } = await props.searchParams;
  if (!courseID) notFound();
  const text = await getTypingText(courseID, materialID);

  return (
    <div className="h-screen flex flex-col bg-(--gray-1)">
      <div className="border-b border-(--gray-4) px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-(--gray-11)">Preview</span>
        <a
          href={`/cms/courses/${courseID}/materials/${materialID}`}
          className="text-xs text-(--gray-10) hover:text-(--gray-12) transition-colors"
        >
          ← Back to editor
        </a>
      </div>
      <TypingPreviewClient text={text} />
    </div>
  );
}
