import { UIMessage } from "ai";
import { chatInstance } from "~/lib/aiChatProviders/openrouter";
import { getUser } from "~/lib/get-user";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const user = await getUser();

  const res = await chatInstance.getStream({
    roles: user.roles,
    messages,
  });

  return res;
}
