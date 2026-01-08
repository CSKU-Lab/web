import type { AffectedType } from "~/types/cms-affected-entities";

export const queryKeys = {
  user: {
    all: ["users"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.user.all,
      params,
    ],
  },
  labMaterial: {
    all: ["labMaterials"],
    getByLabId: (labId: string) => [...queryKeys.labMaterial.all, labId],
  },
  course: {
    all: ["courses"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.course.all,
      params,
    ],
    getById: (courseId: string) => [...queryKeys.course.all, courseId],
  },
  section: {
    all: ["sections"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.section.all,
      params,
    ],
    getById: (sectionId: string) => [...queryKeys.section.all, sectionId],
    getStudents: (sectionId: string) => [
      ...queryKeys.section.getById(sectionId),
      "students",
    ],
    logs: {
      allWithParams: (sectionId: string, params?: Record<string, any>) => [
        ...queryKeys.section.getById(sectionId),
        "logs",
        params,
      ],
    },
    labs: {
      all: (sectionId: string) => [
        ...queryKeys.section.getById(sectionId),
        "labs",
      ],
      allWithParams: (sectionId: string, params: Record<string, any>) => [
        ...queryKeys.section.getById(sectionId),
        "labs",
        params,
      ],
    },
  },
  user_group: {
    all: ["user_groups"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.user_group.all,
      params,
    ],
  },
  semester: {
    all: ["semesters"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.semester.all,
      params,
    ],
  },
  material: {
    all: ["materials"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.material.all,
      params,
    ],
    getById: (materialId: string) => [...queryKeys.material.all, materialId],
  },
  lab: {
    all: ["labs"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.lab.all,
      params,
    ],
    getById: (labID: string) => [...queryKeys.course.all, labID],
  },
  defaultLab: {
    all: ["default_labs"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.defaultLab.all,
      params,
    ],
  },
  config: {
    runners: {
      all: (opts?: { includeScript?: boolean }) => {
        if (opts?.includeScript) {
          return ["config", "runners", "includeScript"];
        }
        return ["config", "runners"];
      },
    },
  },
  affectedEntities: {
    get: (type: AffectedType, id: string) => ["affectedEntities", type, id],
  },
} as const;
