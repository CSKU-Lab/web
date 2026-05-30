import type { ReactNode } from "react";
import UsernameAndPassword from "./UsernameAndPassword";
import GoogleSignIn from "./GoogleSignIn";
import QuotesSection from "./QuotesSection";
import ErrorAlert from "~/components/commons/ErrorAlert";

function getErrorMessage(errorCode: string | string[] | undefined): ReactNode | null {
  if (errorCode === "UNAUTHORIZED") {
    return (
      <>
        Your account couldn&apos;t be found. Enter a different email or
        username.{" "}
        <a className="text-blue-9 hover:underline font-medium" href="#">
          Contact Admin
        </a>
      </>
    );
  }
  if (errorCode === "INVALID_CREDENTIAL") return "username or password is incorrect.";
  if (errorCode === "SOMETHING_WENT_WRONG") return "Something went wrong. Please try again later.";
  return null;
}

export function SignInView({ errorCode }: { errorCode?: string | string[] }) {
  const errorMessage = getErrorMessage(errorCode);
  const isError = errorMessage !== null;

  return (
    <div className="flex flex-col lg:flex-row h-screen p-6 bg-(--gray-2)">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full h-full max-w-120 flex flex-col justify-center items-center">
          {isError && <ErrorAlert className="mb-8" message={errorMessage} />}
          <h3 className="text-2xl lg:text-3xl font-semibold text-center">
            Sign in
          </h3>

          <GoogleSignIn />

          <div className="flex gap-2 w-1/2 items-center mt-4">
            <div className="flex-1 border-t border-(--gray-6)"></div>
            <p className="text-sm text-(--gray-8)">or</p>
            <div className="flex-1 border-t border-(--gray-6)"></div>
          </div>

          <UsernameAndPassword />
        </div>

        <div className="flex items-center text-xs gap-1">
          <p className="text-xs lg:text-sm">Made with 🍵</p>
          <a
            className="font-semibold"
            href="https://github.com/SornchaiTheDev"
            target="_blank"
          >
            @SornchaiTheDev
          </a>
          <span>and</span>
          <a
            className="font-semibold"
            href="https://github.com/XEFF09"
            target="_blank"
          >
            @XEFF09
          </a>
        </div>
      </div>
      <QuotesSection />
    </div>
  );
}
