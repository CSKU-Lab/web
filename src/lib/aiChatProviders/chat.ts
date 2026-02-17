import {
  convertToModelMessages,
  LanguageModel,
  Output,
  ToolLoopAgent,
  ToolSet,
  UIMessage,
} from "ai";
import z from "zod";
import { UserRole } from "~/types/user";

interface ChatOptions {
  chatModel: LanguageModel;
  studentTools?: ToolSet;
  instructorTools?: ToolSet;
}

export interface CallOptions {
  roles: UserRole[];
}

export class Chat {
  chatModel: LanguageModel;
  instructorTools: ToolSet;
  studentTools: ToolSet;
  tlAgent: ToolLoopAgent<CallOptions>;

  constructor({ chatModel, studentTools, instructorTools }: ChatOptions) {
    this.chatModel = chatModel;
    this.instructorTools = instructorTools || {};
    this.studentTools = studentTools || {};
    this.tlAgent = new ToolLoopAgent({
      model: this.chatModel,

      callOptionsSchema: z.object({
        roles: z.array(z.enum(["student", "instructor", "admin"])).nonempty(),
      }),

      tools: {
        ...this.instructorTools,
        ...this.studentTools,
      },

      prepareCall: ({ options, ...settings }) => {
        const limitInstructorAccess = ["instructor", "admin"];
        const hasInstructorAccess = options.roles.some((role) =>
          limitInstructorAccess.includes(role),
        );

        return {
          ...settings,
          activeTools: hasInstructorAccess
            ? Object.keys(this.instructorTools)
            : Object.keys(this.studentTools),

          maxToolCalls: 5,
        };
      },

      output: Output.text(),

      instructions: `
        You are an assistant for this application.

        STRICT RULES:
        - If you do not have enough information, say: "I don't have enough information to answer that."
        - If no tool is available to answer the question, say: "I don't have access to that information."
        - NEVER guess.
        - NEVER fabricate data.
        - NEVER act like you queried a tool if you did not.

        When a tool returns structured data:
        - NEVER return raw JSON.
        - Always summarize the result in clean human-readable text.
        - Provide a short and clear conclusion.
      `,
    });
  }

  async getStream({
    roles,
    messages,
  }: CallOptions & { messages: UIMessage[] }) {
    const result = await this.tlAgent.stream({
      options: { roles },
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  }

  _getTools(): string[] {
    return [
      ...Object.keys(this.instructorTools),
      ...Object.keys(this.studentTools),
    ];
  }

  toolMapper(type: string): boolean {
    const prefix = "tool-";
    const tools = [...new Set(this._getTools())].map(
      (tool) => `${prefix}${tool}`,
    );
    console.log("Available tools:", tools);

    return tools.includes(type);
  }
}
