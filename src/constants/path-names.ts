export const pathNames = {
  "/cms": {
    "/": "CMS",
    "/courses": {
      "/": "Courses",
      "/new": "New Course",
      "/[courseId]": {
        "/": "Details",
        "/settings": "Settings",
        "/sections": {
          "/": "Sections",
          "/new": "New Section",
          "/[sectionID]": {
            "/": "Section",
            "/settings": "Settings",
          },
        },
      },
    },
    "/materials": {
      "/": "Materials",
      "/new": "New Material",
      "/[sectionID]": {
        "/": "Details",
      },
    },
    "/users": { "/": "Users Management" },
    "/semesters": { "/": "Semester Management" },
    "/groups": {
      "/": "Groups",
      "/[groupID]": {
        "/": "Details",
      },
    },
  },
};
