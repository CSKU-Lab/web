"use client";
import type { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { createContext, type PropsWithChildren, useState, use } from "react";
import { timeout } from "~/lib/timeout";
import useGetMaterial from "../_hooks/useGetMaterial";
import type { CMSMaterial } from "~/types/cms-material";

type MaterialStatus = "Saved" | "Saving" | "SaveFailed" | "Offline";
export type Tab = "Editor" | "TestCase" | "Config";

interface MaterialContext {
  detail: CMSMaterial | undefined;
  isDetailLoading: boolean;
  description: JSONContent;
  onChangeDescription: (content: JSONContent) => void;
  status: MaterialStatus;
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

const materialContext = createContext<MaterialContext | null>(null);

export function useMaterial() {
  const context = use(materialContext);
  if (!context) {
    throw new Error(
      "useMaterialContext must be used within a MaterialProvider",
    );
  }
  return context;
}

export function Provider({ children }: PropsWithChildren) {
  const Provider = materialContext.Provider;
  const [description, setDescription] = useState<JSONContent>(() => {
    const stringifyDescription = localStorage.getItem("description");
    return JSON.parse(stringifyDescription ?? "{}");
  });

  const [status, setStatus] = useState<MaterialStatus>("Saved");
  const [activeTab, setActiveTab] = useState<Tab>("Editor");

  const onChangeDescription = (content: JSONContent) => {
    setDescription(content);
    localStorage.setItem("description", JSON.stringify(content));
    setStatus("Saving");

    timeout(1000).then(() => setStatus("Saved"));
  };

  const { data: detail, isFetching } = useGetMaterial();

  return (
    <Provider
      value={{
        detail: detail,
        isDetailLoading: isFetching,
        description,
        onChangeDescription,
        status,
        activeTab,
        onChangeTab: setActiveTab,
      }}
    >
      {children}
    </Provider>
  );
}

const MaterialProvider = dynamic(
  () => import("./MaterialProvider").then((mod) => mod.Provider),
  {
    ssr: false,
  },
);

export default MaterialProvider;
