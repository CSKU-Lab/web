import { Chat } from "./chat";
import { materialTool } from "~/app/tools/material.tools";
import {
  convertToModelMessages,
  Output,
  ToolLoopAgent,
  ToolSet,
  UIMessage,
} from "ai";
import { instructorPrompt } from "./prompts/instructor";

class InstructorChat extends Chat {
  agent: ToolLoopAgent;
  tools?: ToolSet;

  constructor() {
    const {
      createMaterial,
      updateMaterial,
      deleteMaterial,
      getMaterial,
      getMaterialPagination,
    } = materialTool();

    super({
      model_id: process.env.MODEL_ID || "",
    });

    (this.tools = {
      createMaterial,
      updateMaterial,
      deleteMaterial,
      getMaterial,
      getMaterialPagination,
    }),
      (this.agent = new ToolLoopAgent({
        model: this.chatModel,
        tools: this.tools,
        prepareCall: ({ options, ...settings }) => {
          return {
            ...settings,
            maxToolCalls: 3,
            instructions: instructorPrompt,
          };
        },
        temperature: 0.2,
        output: Output.text(),
      }));
  }

  async getStream({ messages }: { messages: UIMessage[] }) {
    const result = await this.agent.stream({
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  }

  toolMapper(type: string): boolean {
    const prefix = "tool-";
    const tools = this.tools
      ? Object.keys(this.tools).map((tool) => `${prefix}${tool}`)
      : [];
    return tools.includes(type);
  }
}

export const chatInstance = new InstructorChat();
