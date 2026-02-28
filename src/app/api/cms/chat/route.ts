import { UIMessage } from "ai";
import { chatInstance as instructor } from "~/lib/aiChatProviders/instructor.chat";
import { getUser } from "~/lib/get-user";

export async function POST(req: Request) {
  const {
    messages,
  }: {
    messages: UIMessage[];
  } = await req.json();

  const user = await getUser();
  const hasToolAccess = user.roles.some((role) =>
    ["admin", "instructor"].includes(role),
  );

  if (hasToolAccess) {
    return instructor.getStream({
      messages,
    });
  }
}
