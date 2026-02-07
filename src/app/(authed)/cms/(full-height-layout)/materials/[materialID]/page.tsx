import { cmsMaterialService } from "~/services/cms-material.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "./_materialTypes/CodeMaterial";
import { getUser } from "~/lib/get-user";

async function MaterialPage(props: {
  params: Promise<{ materialID: string }>;
}) {
  const params = await props.params;
  const material = await cmsMaterialService.getById(params.materialID);
  const user = await getUser();
  const isOwner = material.created_by.id === user.sub;

  if (material.type === "code") {
    return <CodeMaterial isOwner={isOwner} />;
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
