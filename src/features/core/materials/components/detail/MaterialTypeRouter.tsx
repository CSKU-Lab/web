"use client";

import { type ReactNode } from "react";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import TypingSection from "~/features/core/materials/components/TypingSection";
import { MaterialType } from "~/types/core-material";
import DetailSection from "~/features/core/materials/components/detail/DetailSection";
import DocumentViewer from "~/features/core/materials/components/detail/DocumentViewer";
import { useParams } from "next/navigation";

interface Props {
  children: ReactNode;
  initialType: string;
}

export default function MaterialTypeRouter({ children, initialType }: Props) {
  const { data: material } = useGetCoreMaterial();
  const { sectionID, slug: labID, materialID } = useParams<{
    sectionID: string;
    slug: string;
    materialID: string;
  }>();

  const type = material?.type ?? initialType;

  if (type === MaterialType.TYPE) {
    return (
      <div className="flex flex-col h-full">
        <DetailSection sectionID={sectionID} labID={labID} materialID={materialID} />
        <TypingSection />
      </div>
    );
  }

  if (type === MaterialType.DOCUMENT) {
    return (
      <div className="flex flex-col h-full">
        <DetailSection sectionID={sectionID} labID={labID} materialID={materialID} showSubmit={false} />
        <DocumentViewer />
      </div>
    );
  }

  return <>{children}</>;
}
