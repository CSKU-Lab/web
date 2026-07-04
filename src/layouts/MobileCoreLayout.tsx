import { type ReactNode } from "react";
import Link from "next/link";
import { MobileBottomNav } from "~/features/shared/mobile-nav";
import { version } from "../../package.json";

interface Props {
  children: ReactNode;
  homePath?: string;
}

/**
 * Dedicated mobile shell for the student core app: a slim top bar, a scrollable
 * content area, and a fixed bottom tab bar. Rendered instead of `CoreLayout`
 * when the request is detected as coming from a mobile device.
 */
export default function MobileCoreLayout({ children, homePath = "/" }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col bg-(--gray-1)">
      <header className="flex shrink-0 items-baseline gap-2 border-b border-(--gray-4) bg-(--gray-2) px-4 py-3">
        <Link
          href={homePath}
          className="font-medium text-(--gray-12) transition-colors hover:text-(--accent-9)"
        >
          CS Lab
        </Link>
        <span className="text-xs text-(--gray-11)">{version}</span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto pb-16">{children}</main>

      <MobileBottomNav />
    </div>
  );
}
