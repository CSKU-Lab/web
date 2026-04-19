import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "./_materialTypes/CodeMaterial";
import TypingMaterial from "./_materialTypes/TypingMaterial";
import { getUser } from "~/lib/get-user";

async function getMaterial(materialID: string) {
  try {
    return await cmsMaterialService.getById(materialID);
  } catch (error: any) {
    if (error) {
      notFound();
    }
    throw error;
  }
}

async function MaterialPage(props: {
  params: Promise<{ materialID: string }>;
}) {
  const { materialID } = await props.params;
  const material = await getMaterial(materialID);
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
        Material type &quot;{titleFormatter(material.type)}&quot; is not
        supported yet.
      </h4>
    </div>
  );
}

export default MaterialPage;
