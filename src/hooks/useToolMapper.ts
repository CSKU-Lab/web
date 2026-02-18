import { chatInstance } from "~/lib/aiChatProviders/instructor.chat";

export const useToolMapper = () => {
  const isExist = (type: string) => {
    return chatInstance.toolMapper(type);
  };
  return { isExist };
};
