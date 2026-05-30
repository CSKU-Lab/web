import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "~/features/cms/materials/types/CodeMaterial";
import TypingMaterial from "~/features/cms/materials/types/TypingMaterial";
import DocumentMaterial from "~/features/cms/materials/types/DocumentMaterial";
import { getUser } from "~/lib/get-user";

async function getMaterial(courseID: string, materialID: string) {
  try {
    return await cmsMaterialService.getById(courseID, materialID);
  } catch (error: any) {
    if (error) {
      notFound();
    }
    throw error;
  }
}

export async function CourseMaterialView({
  courseID,
  materialID,
}: {
  courseID: string;
  materialID: string;
}) {
  const material = await getMaterial(courseID, materialID);
  const user = await getUser();
  const isOwner = material.created_by.id === user.sub;

  if (material.type === "code") {
    return <CodeMaterial isOwner={isOwner} />;
  }

  if (material.type === "typing") {
    return <TypingMaterial isOwner={isOwner} />;
  }

  if (material.type === "document") {
    return <DocumentMaterial isOwner={isOwner} />;
  }

  return (
    <div className="flex justify-center items-center h-full">
      <h4 className="text-(--gray-11)">
        Material type &quot;{titleFormatter(material.type)}&quot; is not supported
        yet.
      </h4>
    </div>
  );
}
