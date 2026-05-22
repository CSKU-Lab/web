import { type ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import SessionProvider from "~/providers/SessionProvider";
import QueryProvider from "~/providers/QueryProvider";
import { getUser } from "~/lib/get-user";
import CommandPalette from "~/components/CommandPalette";

interface Props {
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getUser();

  return (
    <JotaiProvider>
      <QueryProvider>
        <SessionProvider {...{ user }}>
          <CommandPalette />
          {children}
        </SessionProvider>
      </QueryProvider>
    </JotaiProvider>
  );
}
