import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { coreSidebarService } from "~/services/core-sidebar.service";
import { coreSectionService } from "~/services/core-section.service";
import { coreLabService } from "~/services/core-lab.service";
import type { SectionLab } from "~/types/core-section-lab";
import type { LabMaterial } from "~/types/core-lab-material";

export const useSidebar = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const previousPathname = useRef<string | null>(null);

  const query = useQuery({
    queryKey: queryKeys.sidebar.get(),
    queryFn: () => coreSidebarService.getSidebar(),
    refetchOnMount: "always",
  });

  useEffect(() => {
    const wasOnAnotherRoute =
      previousPathname.current !== null && previousPathname.current !== "/";
    previousPathname.current = pathname;

    if (pathname !== "/" || !wasOnAnotherRoute) return;

    void queryClient.invalidateQueries({
      queryKey: queryKeys.sidebar.get(),
    });
  }, [pathname, queryClient]);

  return query;
};

export const useSidebarLabs = (sectionID: string, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.sidebar.labs(sectionID),
    queryFn: () =>
      coreSectionService.getLabsInSectionPagination(sectionID, {
        page: 1,
        page_size: 100,
        sort_by: "position",
        sort_order: "asc",
      }),
    enabled,
    select: (response) => response.data,
  });

export const useSidebarMaterials = (
  sectionID: string,
  labID: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: queryKeys.sidebar.materials(sectionID, labID),
    queryFn: () =>
      coreLabService.getMaterialsInLabPagination(labID, sectionID, {
        page: 1,
        page_size: 100,
        sort_by: "position",
        sort_order: "asc",
      }),
    enabled,
    select: (response) => response.data,
  });

export type SidebarLab = SectionLab;
export type SidebarMaterial = LabMaterial;
