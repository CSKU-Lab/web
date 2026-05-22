"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import useGetMaterial from "../../_hooks/useGetMaterial";
import { initialContentAtom } from "./_stores/content.store";
import { isLoadingAtom } from "./_stores/loading.store";
import { isOwnerAtom } from "./_stores/owner.store";
import type { DocumentMaterialResponse } from "./_types/document-material-response";
import DetailSection from "./_components/DetailSection";
import ContentSection from "./_components/ContentSection";

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
