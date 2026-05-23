import useCoreLab from "./useCoreLab";

export function useIsLabReadonly(): boolean {
  const { useGetLabSection } = useCoreLab();
  const { data: labSection } = useGetLabSection();
  return labSection?.status === "readonly";
}
