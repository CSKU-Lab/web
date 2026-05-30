import type { Metadata } from "next";
import { SignInView } from "~/features/shared/auth";

export const metadata: Metadata = { title: "Sign In | CS Lab" };

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SignInPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <SignInView errorCode={error} />;
}

export default SignInPage;
