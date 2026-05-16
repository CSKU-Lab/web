import { UIMessage } from "ai";
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
    const { chatInstance: instructor } = await import(
      "~/lib/aiChatProviders/instructor.chat"
    );
    return instructor.getStream({
      messages,
    });
  }
}
