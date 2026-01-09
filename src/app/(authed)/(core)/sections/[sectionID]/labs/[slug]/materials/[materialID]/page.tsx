import LeftSection from "../_components/LeftSection";
import RightSection from "../_components/RightSection";
import { headers } from "next/headers";
import { isFromMobile } from "~/lib/isFromMobile";
import LottieComp from "~/components/commons/Lottie";
import floating from "~/assets/lotties/foating.json";
import DescriptionTab from "../_components/DescriptionTab";
import { type Metadata } from "next";
import DetailSection from "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/DetailSection";

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

async function MaterialPage(props: { params: Promise<{ problemId: string }> }) {
  const params = await props.params;
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

  const headerDisplay = {
    name: true,
    type: false,
    submissions: false,
    createdBy: false,
    visibility: false,
    status: true,
  };

  return (
    <>
      <DetailSection headerDisplay={headerDisplay} />
      <div className="flex flex-1 min-h-0">
        <LeftSection descriptionTab={<DescriptionTab />} />
        <RightSection />
      </div>
    </>
  );
}

export default MaterialPage;
