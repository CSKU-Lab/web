import { cmsMaterialService } from "~/services/cms-material.service";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import MaterialProvider from "./_providers/MaterialProvider";
import { titleFormatter } from "~/lib/formatters/titleFormatter";

async function MaterialPage(props: {
  params: Promise<{ materialID: string }>;
}) {
  const params = await props.params;
  const material = await cmsMaterialService.getById(params.materialID);

  if (material.type === "code") {
    return (
      <>
        <MaterialProvider>
          <DetailSection />
          <div className="flex flex-1 min-h-0">
            <DescriptionSection />
            <MultipleTabsSection />
          </div>
        </MaterialProvider>
      </>
    );
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
