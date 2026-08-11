"use client";

import { createContext, useContext, type ReactNode } from "react";
import useCoreLab from "~/features/core/sections/hooks/labs/useCoreLab";

type LabStatus = "hidden" | "open" | "readonly" | "disabled";

const InitialLabStatusContext = createContext<LabStatus | undefined>(undefined);

export function InitialLabStatusProvider({
  status,
  children,
}: {
  status: LabStatus;
  children: ReactNode;
}) {
  return (
    <InitialLabStatusContext.Provider value={status}>
      {children}
    </InitialLabStatusContext.Provider>
  );
}

export function useIsLabReadonly(): boolean {
  const initialStatus = useContext(InitialLabStatusContext);
  const { useGetLabSection } = useCoreLab();
  const { data: labSection } = useGetLabSection();
  return (labSection?.status ?? initialStatus) === "readonly";
}
