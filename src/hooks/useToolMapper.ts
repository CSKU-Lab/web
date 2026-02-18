import { chatInstance } from "~/lib/aiChatProviders/openrouter";

export const useToolMapper = () => {
  const isExist = (type: string) => {
    return chatInstance.toolMapper(type);
  };
  return { isExist };
};
