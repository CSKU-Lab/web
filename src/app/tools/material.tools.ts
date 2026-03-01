import { tool } from "ai";
import { marked } from "marked";
import { cmsMaterialService } from "~/services/cms-material.service";
import {
  createMaterialSchema,
  paginationSchema,
  updateMaterialSchema,
} from "./schemas/material.schema";
import z from "zod";
import { generateJSON } from "@tiptap/html";
import { ext } from "~/components/tiptap-templates/simple/extensions";

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

  async function textToTiptapJSON(text: string) {
    const html = await marked.parse(text);
    return generateJSON(html, ext);
  }

  const updateMaterial = tool({
    description: "Update a material by id",
    inputSchema: z.object({
      id: z.string(),
      data: updateMaterialSchema,
    }),
    execute: async ({ id, data }) => {
      try {
        const { payload } = data;

        if (
          payload &&
          typeof payload === "object" &&
          "description" in payload &&
          payload.description
        ) {
          const descriptionJSON = await textToTiptapJSON(payload.description);
          payload.description = JSON.stringify(descriptionJSON);
        }

        await cmsMaterialService.update(id, data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
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
