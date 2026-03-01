import { openrouter } from "@openrouter/ai-sdk-provider";
import { LanguageModel, UIMessage } from "ai";

interface ChatOptions {
  model_id: string;
}

export abstract class Chat {
  chatModel: LanguageModel;

  constructor({ model_id }: ChatOptions) {
    this.chatModel = openrouter.chat(model_id);
  }

  abstract getStream({
    messages,
  }: {
    messages: UIMessage[];
  }): Promise<Response>;
}
