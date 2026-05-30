"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";
import { typingTextAtom, saveStatusAtom, viewAtom } from "~/features/cms/materials/types/TypingMaterial/stores/typing-text.store";
import { isOwnerAtom } from "~/features/cms/materials/types/TypingMaterial/stores/owner.store";
import TypingDetailSection from "~/features/cms/materials/types/TypingMaterial/components/DetailSection";
import TextEditor from "~/features/cms/materials/types/TypingMaterial/components/TextEditor";
import TypingTest from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/TypingTest";
import type { TypingMaterialPayload } from "~/types/typing-material";

interface Props {
  isOwner: boolean;
}

export default function TypingMaterial({ isOwner }: Props) {
  const { data, isLoading } = useGetMaterial();
  const setText = useSetAtom(typingTextAtom);
  const setSaveStatus = useSetAtom(saveStatusAtom);
  const setIsOwner = useSetAtom(isOwnerAtom);
  const view = useAtomValue(viewAtom);
  const text = useAtomValue(typingTextAtom);

  useEffect(() => {
    setIsOwner(isOwner);
  }, [isOwner, setIsOwner]);

  useEffect(() => {
    if (isLoading) return;
    const payload = data?.payload as TypingMaterialPayload | undefined;
    if (payload?.content) {
      setText(payload.content);
      setSaveStatus("Saved");
    }
  }, [data, isLoading, setText, setSaveStatus]);

  return (
    <>
      <TypingDetailSection />
      <div className="flex flex-col flex-1 min-h-0 border border-t-0 border-l-0 2xl:border-l">
        {view === "editor" ? (
          <TextEditor />
        ) : (
          <TypingTest text={text} />
        )}
      </div>
    </>
  );
}
