import type { AffectedType } from "~/types/cms-affected-entities";

export const queryKeys = {
  user: {
    all: ["users"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.user.all,
      params,
    ],
    getById: (userId: string) => [...queryKeys.user.all, userId],
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
    lab: {
      getById: (sectionId: string, labId: string) => [labId, sectionId],
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
      getById: (sectionId: string, labId: string) => [
        ...queryKeys.section.labs.all(sectionId),
        labId,
      ],
      materials: {
        all: (sectionId: string, labId: string) => [
          ...queryKeys.section.labs.getById(sectionId, labId),
          "materials",
        ],
        allWithParams: (
          sectionId: string,
          labId: string,
          params: Record<string, any>,
        ) => [
          ...queryKeys.section.labs.getById(sectionId, labId),
          "materials",
          params,
        ],
      },
      status: (sectionId: string, labId: string) => [
        ...queryKeys.section.labs.getById(sectionId, labId),
        "status",
      ],
    },
    gradebook: (sectionId: string) => [
      ...queryKeys.section.getById(sectionId),
      "gradebook",
    ],
    submissions: (sectionId: string, labId: string, materialId: string) => [
      ...queryKeys.section.getById(sectionId),
      "labs",
      labId,
      "materials",
      materialId,
      "submissions",
    ],
    submissionsOfStudent: (
      sectionId: string,
      labId: string,
      materialId: string,
      studentId: string,
      params?: Record<string, any>,
    ) => [
      ...queryKeys.section.submissions(sectionId, labId, materialId),
      "student",
      studentId,
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
  },
  material: {
    all: ["materials"],
    allWithParams: (courseId: string, params: Record<string, any>) => [
      ...queryKeys.material.all,
      courseId,
      params,
    ],
    getById: (courseId: string, materialId: string) => [
      ...queryKeys.material.all,
      courseId,
      materialId,
    ],
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
  runner: {
    all: ["runners"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.runner.all,
      params,
    ],
    getById: (runnerId: string) => [...queryKeys.runner.all, runnerId],
  },
  compare: {
    all: ["compares"],
    allWithParams: (params: Record<string, any>) => [
      ...queryKeys.compare.all,
      params,
    ],
    getById: (compareId: string) => [...queryKeys.compare.all, compareId],
  },
  affectedEntities: {
    get: (type: AffectedType, id: string) => ["affectedEntities", type, id],
  },
  search: {
    cms: (q: string) => ["cms-search", q],
    core: (q: string) => ["core-search", q],
  },
  sidebar: {
    get: () => ["sidebar"],
  },
  core: {
    all: "core",
    featuredCourses: {
      all: ["featuredCourses"],
      allWithParams: (params: Record<string, any>) => [
        ...queryKeys.core.featuredCourses.all,
        params,
      ],
    },
    myCourses: {
      all: ["myCourses"],
      allWithParams: (params: Record<string, any>) => [
        ...queryKeys.core.myCourses.all,
        params,
      ],
    },
    courses: {
      all: ["courses"],
      allWithParams: (params: Record<string, any>) => [
        ...queryKeys.core.courses.all,
        params,
      ],
    },
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
      getBestTypingSubmission: (materialID: string, labID: string, sectionID: string) => [
        ...queryKeys.core.material.all,
        materialID,
        labID,
        sectionID,
        "best-typing-submission",
      ],
    },
    submission: {
      all: "submissions",
      getPagination: (
        materialID?: string,
        labID?: string,
        sectionID?: string,
      ) => [
        ...queryKeys.core.submission.all,
        materialID,
        labID,
        sectionID,
        "submissions-pagination",
      ],
    },
  },
} as const;
