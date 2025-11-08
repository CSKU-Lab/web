"use client";
import type { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import {
  createContext,
  type PropsWithChildren,
  useState,
  use,
  useEffect,
  useDeferredValue,
} from "react";
import useGetMaterial from "../_hooks/useGetMaterial";
import type { CMSMaterial } from "~/types/cms-material";
import { api } from "~/lib/api.client";
import useInputDebounce from "~/hooks/useInputDebounce";

type MaterialStatus = "UnSaved" | "Saved" | "Saving" | "SaveFailed" | "Offline";
export type Tab = "Editor" | "TestCase" | "Config";

interface MaterialContext {
  detail: CMSMaterial | undefined;
  isDetailLoading: boolean;
  description: JSONContent | null;
  onChangeDescription: (content: JSONContent) => Promise<void>;
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
  const [description, setDescription] = useState<
    JSONContent | null | undefined
  >(undefined);
  const deferredDescription = useDeferredValue(description);
  const debouncedDescription = useInputDebounce(description, 2000);

  const [status, setStatus] = useState<MaterialStatus>("Saved");
  const [activeTab, setActiveTab] = useState<Tab>("Editor");

  const onChangeDescription = async (content: JSONContent) => {
    if (deferredDescription === undefined) return;
    setStatus("UnSaved");
    setDescription(content);
  };

  const { data: detail, isFetching } = useGetMaterial();

  useEffect(() => {
    if (isFetching) return;

    if (detail) {
      setDescription(JSON.parse(detail.payload.description));
    }
  }, [detail, isFetching]);

  console.log({ debouncedDescription, detail });

  useEffect(() => {
    if (detail == null) return;
    if (debouncedDescription == undefined) return;
    if (JSON.stringify(debouncedDescription) === detail.payload.description)
      return;

    const handleOnSave = async () => {
      setStatus("Saving");
      try {
        await api.patch(`/cms/materials/${detail.id}`, {
          type: "code",
          payload: {
            description: JSON.stringify(debouncedDescription),
          },
        });
        setStatus("Saved");
      } catch (error) {
        setStatus("SaveFailed");
      }
    };
    handleOnSave();
  }, [debouncedDescription, detail]);

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
