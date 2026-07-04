import LeftSection from "~/features/core/materials/components/LeftSection";
import RightSection from "~/features/core/materials/components/RightSection";
import { type Metadata } from "next";
import { ogImages } from "~/lib/og";
import DetailSection from "~/features/core/materials/components/detail/DetailSection";
import MaterialPageClient from "~/features/core/materials/components/detail/MaterialPageClient";
import MaterialTypeRouter from "~/features/core/materials/components/detail/MaterialTypeRouter";
import MobileMaterialView from "~/features/core/materials/components/detail/MobileMaterialView";
import { getIsMobile } from "~/lib/get-is-mobile";
import { coreMaterialService } from "~/services/core-material.service";
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}): Promise<Metadata> => {
  const { sectionID, slug, materialID } = await params;
  const ogUrl = ogImages.material(materialID);

  try {
    const material = await coreMaterialService.getById(materialID, sectionID, slug);
    return {
      title: `${material.name} | CS Lab`,
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogUrl] },
    };
  } catch {
    return {
      openGraph: { images: [{ url: ogUrl, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogUrl] },
    };
  }
};

export async function MaterialPage(props: {
  params: Promise<{ sectionID: string; slug: string; materialID: string }>;
}) {
  const params = await props.params;
  const { sectionID, slug: labID, materialID } = params;
  const isMobile = await getIsMobile();

  const material = await coreMaterialService.getById(materialID, sectionID, labID);

  if (isMobile) {
    return (
      <MaterialPageClient materialID={materialID}>
        <MobileMaterialView initialType={material.type} />
      </MaterialPageClient>
    );
  }

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
