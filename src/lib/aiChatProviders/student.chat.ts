import { Chat } from "./chat";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import { studentPrompt } from "./prompts/student";
import { coreMaterialService } from "~/services/core-material.service";
import { ProblemProps } from "~/app/api/chat/route";

class StudentChat extends Chat {
  constructor() {
    super({
      model_id: process.env.MODEL_ID || "",
    });
  }

  protected async _getMaterial({ materialID, sectionID, labID }: ProblemProps) {
    let materialContext = "";
    const material = await coreMaterialService.getById(
      materialID,
      sectionID,
      labID,
    );
    materialContext = `
      Title: ${material.name}

      Status: ${material.status}

      Payload:
      ${material.payload}

      Only answer based on this problem.
    `;
    return materialContext;
  }

  async getStream({
    messages,
    probIDs,
  }: {
    messages: UIMessage[];
    probIDs: ProblemProps;
  }) {
    const matContext = await this._getMaterial(probIDs);

    const systemPrompt = matContext
      ? `${studentPrompt}\n\n${matContext}`
      : studentPrompt;

    const result = streamText({
      model: this.chatModel,
      messages: await convertToModelMessages(messages),
      system: systemPrompt,
      temperature: 0.2,
      output: Output.text(),
    });

    return result.toUIMessageStreamResponse();
  }
}

export const chatInstance = new StudentChat();
