import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  LanguageModel,
  UIMessage,
} from "ai";

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

  protected customResponse(text: string) {
    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute({ writer }) {
          writer.write({
            type: "text-start",
            id: "refusal",
          });

          writer.write({
            type: "text-delta",
            id: "refusal",
            delta: text,
          });

          writer.write({
            type: "text-end",
            id: "refusal",
          });
        },
      }),
    });
  }

  protected errorStreamResponse(message: string) {
    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute({ writer }) {
          writer.write({
            type: "data-error",
            data: message,
          });
        },
      }),
    });
  }
}
