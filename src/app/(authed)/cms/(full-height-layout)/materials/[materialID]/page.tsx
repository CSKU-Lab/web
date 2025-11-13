import { cmsMaterialService } from "~/services/cms-material.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "./_materialTypes/CodeMaterial";

async function MaterialPage(props: {
  params: Promise<{ materialID: string }>;
}) {
  const params = await props.params;
  const material = await cmsMaterialService.getById(params.materialID);

  if (material.type === "code") {
    return <CodeMaterial />;
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
