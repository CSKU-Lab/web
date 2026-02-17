import { tool } from "ai";
import { z } from "zod";
import { cmsMaterialService } from "~/services/cms-material.service";

const createMaterialSchema = z.object({
  name: z.string(),
  type: z.enum(["document", "code", "type"]),
  tags: z.array(z.string()),
  visibility: z.enum(["public", "private"]).default("public"),
});

const updateMaterialSchema = createMaterialSchema.partial().extend({
  payload: z.any().nullable(),
});

const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const materialTool = () => {
  const createMaterial = tool({
    description: "Create a new material",
    inputSchema: createMaterialSchema,
    execute: async (payload) => {
      const id = await cmsMaterialService.create(payload);
      return { success: true, id };
    },
  });

  const getMaterial = tool({
    description: "Get material by id",
    inputSchema: z.object({
      id: z.string(),
    }),
    execute: async ({ id }) => {
      const material = await cmsMaterialService.getById(id);
      return material;
    },
  });

  const updateMaterial = tool({
    description: "Update a material by id",
    inputSchema: z.object({
      id: z.string(),
      data: updateMaterialSchema,
    }),
    execute: async ({ id, data }) => {
      await cmsMaterialService.update(id, data);
      return { success: true };
    },
  });

  const deleteMaterial = tool({
    description: "Delete material by id",
    inputSchema: z.object({
      id: z.string(),
    }),
    execute: async ({ id }) => {
      await cmsMaterialService.delete(id);
      return { success: true };
    },
  });

  const getMaterialPagination = tool({
    description: "Get paginated materials list",
    inputSchema: paginationSchema,
    execute: async (params) => {
      const result = await cmsMaterialService.getPagination(params);
      return result;
    },
  });

  return {
    createMaterial,
    getMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialPagination,
  };
};
