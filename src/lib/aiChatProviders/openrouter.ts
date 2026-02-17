import { openrouter } from "@openrouter/ai-sdk-provider";
import { Chat } from "./chat";
import { ToolSet } from "ai";
import { materialTool } from "~/app/tools/material.tools";

class OpenrouterChat extends Chat {
  constructor() {
    const {
      createMaterial,
      updateMaterial,
      deleteMaterial,
      getMaterial,
      getMaterialPagination,
    } = materialTool();

    const instructorTools: ToolSet = {
      createMaterial,
      updateMaterial,
      deleteMaterial,
      getMaterial,
      getMaterialPagination,
    };
    const studentTools: ToolSet = {
      getMaterial,
      getMaterialPagination,
    };

    super({
      chatModel: openrouter.chat(process.env.MODEL_ID || ""),
      instructorTools,
      studentTools,
    });
  }
}

export const chatInstance = new OpenrouterChat();
