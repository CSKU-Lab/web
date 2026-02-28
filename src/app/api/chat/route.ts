import { UIMessage } from "ai";
import { chatInstance as instructor } from "~/lib/aiChatProviders/instructor.chat";
import { chatInstance as student } from "~/lib/aiChatProviders/student.chat";
import { getUser } from "~/lib/get-user";

export interface ProblemProps {
  materialID: string;
  labID: string;
  sectionID: string;
}

export async function POST(req: Request) {
  const {
    messages,
    probIDs,
  }: {
    messages: UIMessage[];
    probIDs?: ProblemProps;
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

  if (!probIDs) {
    return;
  }

  return student.getStream({
    messages,
    probIDs,
  });
}
