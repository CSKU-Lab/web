import { Chat } from "./chat";
import { convertToModelMessages, Output, streamText, UIMessage } from "ai";
import { studentPrompt } from "./prompts/student";
import { ProblemProps } from "~/app/api/chat/route";
import { coreMaterialService } from "~/services/core-material.service";
import { CoreCodeMaterial } from "~/types/core-code-material";
import { askForSolutionResponse } from "./prevents/solution.responses";
import { askForSolutionPhrases } from "./prevents/solution.phrases";

class StudentChat extends Chat {
  solutionRegex: RegExp;
  constructor() {
    super({
      model_id: process.env.MODEL_ID || "",
    });
    this.solutionRegex = this._buildRegex();
  }

  private _buildRegex() {
    const escaped = askForSolutionPhrases.map((p) =>
      p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    return new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
  }

  private async _getMaterial({ materialID, sectionID, labID }: ProblemProps) {
    try {
      let materialContext = "";
      const { name, status, payload } =
        await coreMaterialService.getById<CoreCodeMaterial>(
          materialID,
          sectionID,
          labID,
        );
      materialContext = `
        Title: ${name}
        Status: ${status}
        Allowed Languages: ${payload.allowed_runners?.join(", ")}
        Payload: ${payload.description}

        Only answer based on this material problem.
      `;
      return materialContext;
    } catch (error) {
      throw new Error("Failed to fetch material context");
    }
  }

  private _isAskingForSolution(messages: UIMessage[]): boolean {
    const lastMessage = messages.at(-1);
    if (!lastMessage?.parts) return false;

    return lastMessage.parts.some(
      (part) => part.type === "text" && this.solutionRegex.test(part.text),
    );
  }

  async getStream({
    messages,
    probIDs,
  }: {
    messages: UIMessage[];
    probIDs: ProblemProps;
  }) {
    let context = null;

    try {
      if (messages.length === 1) {
        context = await this._getMaterial(probIDs);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return this.errorStreamResponse(errorMessage);
    }

    const systemPrompt = context
      ? `${studentPrompt}\n\n${context}`
      : studentPrompt;

    if (this._isAskingForSolution(messages)) {
      return this.customResponse(askForSolutionResponse);
    }

    return streamText({
      model: this.chatModel,
      messages: await convertToModelMessages(messages),
      system: systemPrompt,
      temperature: 0.0,
      output: Output.text(),
    }).toUIMessageStreamResponse();
  }
}

export const chatInstance = new StudentChat();
