import { Chat } from "./chat";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import { studentPrompt } from "./prompts/student";

class StudentChat extends Chat {
  constructor() {
    super({
      model_id: process.env.MODEL_ID || "",
    });
  }

  async getStream({ messages }: { messages: UIMessage[] }) {
    const result = streamText({
      model: this.chatModel,
      messages: await convertToModelMessages(messages),
      system: studentPrompt,
      temperature: 0.2,
      output: Output.text(),
    });

    return result.toUIMessageStreamResponse();
  }
}

export const chatInstance = new StudentChat();
