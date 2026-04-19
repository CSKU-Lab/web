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

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ courseId: string; problemId: string }>;
}): Promise<Metadata> => {
  // const { courseId, problemId } = params;

  const labName = "Lab 1.1 Find a, b in which a*b=n and (a+b) is the lowest";
  const isNotFit = labName.length > 32;
  let title = labName.slice(0, 32);

  if (isNotFit) title += "...";

  return {
    title: `${title} | CS Lab`,
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

  return (
    <MaterialPageClient materialID={materialID}>
      <MaterialTypeRouter>
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
