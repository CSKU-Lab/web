import { UIMessage } from "ai";
import { chatInstance as instructor } from "~/lib/aiChatProviders/instructor.chat";
import { chatInstance as student } from "~/lib/aiChatProviders/student.chat";
import { getUser } from "~/lib/get-user";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const user = await getUser();
  const hasToolAccess = user.roles.some((role) =>
    ["admin", "instructor"].includes(role),
  );

  if (hasToolAccess) {
    const res = await instructor.getStream({
      messages,
    });

    return res;
  }

  const res = await student.getStream({
    messages,
  });
  return res;
}
