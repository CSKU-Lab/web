import LeftSection from "../_components/LeftSection";
import RightSection from "../_components/RightSection";
import { headers } from "next/headers";
import { isFromMobile } from "~/lib/isFromMobile";
import LottieComp from "~/components/commons/Lottie";
import floating from "~/assets/lotties/foating.json";
import { type Metadata } from "next";
import DetailSection from "./_components/DetailSection";
import MaterialPageClient from "./_components/MaterialPageClient";
import MaterialTypeRouter from "./_components/MaterialTypeRouter";
import { coreMaterialService } from "~/services/core-material.service";
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}): Promise<Metadata> => {
  const { sectionID, slug, materialID } = await params;
  const material = await coreMaterialService.getById(materialID, sectionID, slug);
  return {
    title: `${material.name} | CS Lab`,
  };
};

async function MaterialPage(props: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}) {
  const params = await props.params;
  const { sectionID, slug: labID, materialID } = params;
  const userAgent = (await headers()).get("User-Agent");

  if (isFromMobile(userAgent)) {
    return (
      <div className="fixed inset-0 h-screen flex flex-col justify-center items-center gap-12">
        <LottieComp animationData={floating} width={300} height={300} />
        <h2 className="text-center text-sm">
          Sorry but this page doesn&apos;t support on mobile devices.
        </h2>
      </div>
    );
  }

  const material = await coreMaterialService.getById(materialID, sectionID, labID);

  return (
    <MaterialPageClient materialID={materialID}>
      <MaterialTypeRouter initialType={material.type}>
        <DetailSection
          sectionID={sectionID}
          labID={labID}
          materialID={materialID}
        />
        <div className="flex flex-1 min-h-0">
          <LeftSection />
          <RightSection />
        </div>
      </MaterialTypeRouter>
    </MaterialPageClient>
  );
}

export default MaterialPage;
