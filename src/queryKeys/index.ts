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
    gradebook: (sectionId: string) => [
      ...queryKeys.section.getById(sectionId),
      "gradebook",
    ],
    submissions: (
      sectionId: string,
      labId: string,
      materialId: string,
    ) => [
      ...queryKeys.section.getById(sectionId),
      "labs",
      labId,
      "materials",
      materialId,
      "submissions",
    ],
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
    materials: {
      all: (labId: string) => [...queryKeys.lab.getById(labId), "materials"],
      allWithParams: (labId: string, params: Record<string, any>) => [
        ...queryKeys.lab.getById(labId),
        "materials",
        params,
      ],
    },
  },
  defaultLab: {
    all: ["default_labs"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.defaultLab.all,
      params,
    ],
  },
  configs: {
    runners: {
      all: (params: Record<string, any>) => {
        return ["configs", "runners", params];
      },
    },
  },
  affectedEntities: {
    get: (type: AffectedType, id: string) => ["affectedEntities", type, id],
  },
  sidebar: {
    get: () => ["sidebar"],
  },
  core: {
    all: "core",
    material: {
      all: "materials",
      getById: (materialID: string) => [...queryKeys.core.all, materialID],
      getSubmissionDetail: (submissionID: string) => [
        ...queryKeys.core.all,
        "submission",
        submissionID,
      ],
      getPagination: (materialID: string) => [
        ...queryKeys.core.material.all,
        materialID,
        "submissions-pagination",
      ],
    },
  },
} as const;
