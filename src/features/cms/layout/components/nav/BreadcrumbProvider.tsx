"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type { ChildrenProps } from "~/types/children-props";
import { cmsCourseService } from "~/services/cms-course.service";
import { cmsSectionService } from "~/services/cms-section.service";
import { cmsLabService } from "~/services/cms-lab.service";
import type { Course } from "~/types/cms-course";
import type { Section } from "~/types/cms-section";
import type { CMSLab } from "~/types/cms-lab";
import { CMSMaterial } from "~/types/cms-material";
import { cmsMaterialService } from "~/services/cms-material.service";

interface EntityData<T = unknown> {
  id: string | null;
  data: T | null;
  isLoading: boolean;
}

interface BreadcrumbContextType {
  entities: {
    course: EntityData<Course>;
    section: EntityData<Section>;
    lab: EntityData<CMSLab>;
    material: EntityData<CMSMaterial>;
  };
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

// Parse URL to extract entity IDs
function parseUrlEntities(pathname: string) {
  const entities = {
    course: null as string | null,
    section: null as string | null,
    lab: null as string | null,
    material: null as string | null,
  };

  // Match course ID: /cms/courses/:courseId
  const courseMatch = pathname.match(/\/courses\/([^/]+)/);
  if (courseMatch) {
    entities.course = courseMatch[1];
  }

  // Match section ID: /cms/courses/:courseId/sections/:sectionId
  const sectionMatch = pathname.match(/\/sections\/([^/]+)/);
  if (sectionMatch) {
    entities.section = sectionMatch[1];
  }

  // Match lab ID: /cms/courses/:courseId/labs/:labId or /.../sections/:sectionId/labs/:labId
  const labMatch = pathname.match(/\/labs\/([^/]+)/);
  if (labMatch) {
    entities.lab = labMatch[1];
  }

  // Match material ID: .../sections/:sectionId/labs/:labId/materials/:materialId
  const materialMatch = pathname.match(/\/materials\/([^/]+)/);
  if (materialMatch) {
    entities.material = materialMatch[1];
  }

  return entities;
}

export function BreadcrumbProvider({ children }: ChildrenProps) {
  const pathname = usePathname();
  const entityIds = useMemo(() => parseUrlEntities(pathname), [pathname]);

  // Eagerly fetch parent entities
  const courseQuery = useQuery({
    queryKey: ["breadcrumb", "course", entityIds.course],
    queryFn: () =>
      entityIds.course
        ? cmsCourseService.getById(entityIds.course)
        : Promise.resolve(null),
    enabled: !!entityIds.course,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const sectionQuery = useQuery({
    queryKey: ["breadcrumb", "section", entityIds.section],
    queryFn: () =>
      entityIds.section
        ? cmsSectionService.getByID(entityIds.section)
        : Promise.resolve(null),
    enabled: !!entityIds.section,
    staleTime: 5 * 60 * 1000,
  });

  const labQuery = useQuery({
    queryKey: ["breadcrumb", "lab", entityIds.lab],
    queryFn: () =>
      entityIds.lab
        ? cmsLabService.getById(entityIds.lab)
        : Promise.resolve(null),
    enabled: !!entityIds.lab,
    staleTime: 5 * 60 * 1000,
  });

  const materialQuery = useQuery({
    queryKey: ["breadcrumb", "material", entityIds.material],
    queryFn: () =>
      entityIds.material
        ? cmsMaterialService.getById(entityIds.course!, entityIds.material)
        : Promise.resolve(null),
    enabled: !!entityIds.course && !!entityIds.material,
    staleTime: 5 * 60 * 1000,
  });

  const value = useMemo(
    () => ({
      entities: {
        course: {
          id: entityIds.course,
          data: courseQuery.data ?? null,
          isLoading: courseQuery.isLoading,
        },
        section: {
          id: entityIds.section,
          data: sectionQuery.data ?? null,
          isLoading: sectionQuery.isLoading,
        },
        lab: {
          id: entityIds.lab,
          data: labQuery.data ?? null,
          isLoading: labQuery.isLoading,
        },
        material: {
          id: entityIds.material,
          data: materialQuery.data ?? null,
          isLoading: materialQuery.isLoading,
        },
      },
    }),
    [
      entityIds,
      courseQuery.data,
      courseQuery.isLoading,
      sectionQuery.data,
      sectionQuery.isLoading,
      labQuery.data,
      labQuery.isLoading,
      materialQuery.data,
      materialQuery.isLoading,
    ],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider",
    );
  }
  return context;
}

// Hook for pages to access entity data
export function useBreadcrumbEntity<T>(
  type: "course" | "section" | "lab" | "material",
): EntityData<T> {
  const { entities } = useBreadcrumbContext();
  return entities[type] as EntityData<T>;
}
