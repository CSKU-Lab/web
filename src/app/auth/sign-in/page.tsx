import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInView } from "~/features/shared/auth";
import { getUser } from "~/lib/get-user";

export const metadata: Metadata = { title: "Sign In | CS Lab" };

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SignInPage({ searchParams }: Props) {
  // Already signed in — skip the sign-in page and go home.
  let isSignedIn = false;
  try {
    await getUser();
    isSignedIn = true;
  } catch {
    // No valid session — render the sign-in page below.
  }

  if (isSignedIn) redirect("/");

  const { error } = await searchParams;
  return <SignInView errorCode={error} />;
}

export default SignInPage;
