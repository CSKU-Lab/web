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
    affectedSections: (semesterId: string) => [
      ...queryKeys.semester.all,
      semesterId,
      "affected_sections",
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
      all: ["config", "runners"],
    },
  },
} as const;
