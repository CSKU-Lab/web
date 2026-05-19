import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial";
import TypingMaterial from "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/TypingMaterial";
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

async function MaterialPage(props: {
  params: Promise<{ courseID: string; materialID: string }>;
}) {
  const { courseID, materialID } = await props.params;
  const material = await getMaterial(courseID, materialID);
  const user = await getUser();
  const isOwner = material.created_by.id === user.sub;

  if (material.type === "code") {
    return <CodeMaterial isOwner={isOwner} />;
  }

  if (material.type === "typing") {
    return <TypingMaterial isOwner={isOwner} />;
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

export default MaterialPage;
