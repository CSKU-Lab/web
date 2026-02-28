import { UIMessage } from "ai";
import { chatInstance as student } from "~/lib/aiChatProviders/student.chat";

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

  if (!probIDs) {
    return;
  }

  return student.getStream({
    messages,
    probIDs,
  });
}
