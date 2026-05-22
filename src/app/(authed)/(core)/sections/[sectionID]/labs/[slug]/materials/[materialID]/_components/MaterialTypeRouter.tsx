"use client";

import { type ReactNode } from "react";
import useGetCoreMaterial from "../_hooks/useGetCoreMaterial";
import TypingSection from "../../_components/TypingSection";
import { MaterialType } from "~/types/core-material";
import DetailSection from "./DetailSection";
import DocumentViewer from "./DocumentViewer";
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
