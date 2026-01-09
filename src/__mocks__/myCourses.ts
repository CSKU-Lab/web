import type { SidebarCourse } from "~/app/(authed)/(core)/types";

export const myCourses: SidebarCourse[] = [
  {
    sectionID: "1",
    name: "Fundamental Computing Concept",
    icon: "🖥️",
    labs: [
      {
        name: "Lab 1",
        labID: "1",
        status: "NONE",
        subItems: [
          {
            name: "Mat 1.1",
            status: "FAILED",
            slug: "lab-1.1",
          },
          {
            name: "Mat 1.2",
            status: "NONE",
            slug: "lab-1.2",
          },
          {
            name: "Mat 1.3",
            status: "NONE",
            slug: "lab-1.3",
          },
        ],
      },
    ],
  },
  {
    sectionID: "2",
    icon: "📚",
    name: "Test",
    labs: [],
  },
];
