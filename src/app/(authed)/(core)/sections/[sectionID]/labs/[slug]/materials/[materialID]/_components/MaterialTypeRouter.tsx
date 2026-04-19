"use client";

import { type ReactNode } from "react";
import useGetCoreMaterial from "../_hooks/useGetCoreMaterial";
import TypingSection from "../../_components/TypingSection";
import { MaterialType } from "~/types/core-material";
import DetailSection from "./DetailSection";
import { useParams } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function MaterialTypeRouter({ children }: Props) {
  const { data: material } = useGetCoreMaterial();
  const { sectionID, slug: labID, materialID } = useParams<{
    sectionID: string;
    slug: string;
    materialID: string;
  }>();

  if (material?.type === MaterialType.TYPE) {
    return (
      <div className="flex flex-col h-full">
        <DetailSection sectionID={sectionID} labID={labID} materialID={materialID} />
        <TypingSection />
      </div>
    );
  }

  return <>{children}</>;
}
