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
            "/logs": "Logs",
            "/labs": {
              "/": "Labs",
              "/[labID]": {
                "/": "Lab",
                "/settings": "Settings",
                "/materials": {
                  "/": "Materials",
                  "/[materialID]": {
                    "/": "Material",
                    "/submissions": "Submissions",
                  },
                },
              },
            },
          },
        },
        "/labs": {
          "/": "Labs",
          "/new": "New Lab",
          "/[labID]": {
            "/": "Details",
            "/add-material": {
              "/": "New Lab Material",
            },
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
