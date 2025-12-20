import type { AffectedType } from "~/types/cms-affected-entities";

export const queryKeys = {
  user: {
    all: ["users"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.user.all,
      params,
    ],
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
