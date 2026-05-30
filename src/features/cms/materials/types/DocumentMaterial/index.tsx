"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";
import { initialContentAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/content.store";
import { isLoadingAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/loading.store";
import { isOwnerAtom } from "~/features/cms/materials/types/DocumentMaterial/stores/owner.store";
import type { DocumentMaterialResponse } from "~/features/cms/materials/types/DocumentMaterial/types/document-material-response";
import DetailSection from "~/features/cms/materials/types/DocumentMaterial/components/DetailSection";
import ContentSection from "~/features/cms/materials/types/DocumentMaterial/components/ContentSection";

interface Props {
  isOwner: boolean;
}

function DocumentMaterial({ isOwner }: Props) {
  const { data, isLoading } = useGetMaterial();
  const setContent = useSetAtom(initialContentAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setIsOwner = useSetAtom(isOwnerAtom);

  useEffect(() => {
    setIsOwner(isOwner);
  }, [isOwner, setIsOwner]);

  useEffect(() => {
    setIsLoading(isLoading);
    if (isLoading) return;
    const payload = data?.payload as DocumentMaterialResponse | undefined;
    if (payload?.content) {
      try {
        setContent(JSON.parse(payload.content));
      } catch {
        // content is not valid JSON, leave editor empty
      }
    }
  }, [data, isLoading, setContent, setIsLoading]);

  return (
    <>
      <DetailSection />
      <div className="flex flex-1 min-h-0 overflow-auto">
        <ContentSection />
      </div>
    </>
  );
}

export default DocumentMaterial;
