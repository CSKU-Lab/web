import type { Metadata } from "next";
import { Anuphan, Poppins } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import { ClientEnv } from "~/lib/client-env";
import { Toaster } from "~/components/ui/sonner";
import ReactScan from "~/react-scan";
import { ThemeProvider } from "~/providers/ThemeProvider";
import "highlight.js/styles/github-dark.css";

import "./globals.css";

const onest = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "900"],
});

const anuphan = Anuphan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-anuphan",
});

const boon = localFont({
  src: [
    {
      path: "../assets/fonts/Boon-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    { path: "../assets/fonts/Boon-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/fonts/Boon-Italic.ttf", weight: "400", style: "italic" },
    {
      path: "../assets/fonts/Boon-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    { path: "../assets/fonts/Boon-Light.ttf", weight: "300", style: "normal" },
    {
      path: "../assets/fonts/Boon-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    { path: "../assets/fonts/Boon-Medium.ttf", weight: "500", style: "normal" },
    {
      path: "../assets/fonts/Boon-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/Boon-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Boon-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-boon",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.WEB_URL ?? "http://localhost:3000"),
  title: "CS Lab",
  description:
    "Programming Lab Web application @Computer Science Kasetsart University",
  keywords: ["CS Lab", "computer science", "CS Grader"],
  authors: [{ name: "SornchaiTheDev" }],
  creator: "SornchaiTheDev",
  openGraph: {
    title: "CS Lab",
    description:
      "Programming Lab Web application @Computer Science Kasetsart University",
    url: process.env.WEB_URL,
    siteName: "CS Lab",
    locale: "en_US",
    type: "website",
  },
  manifest: `${process.env.WEB_URL}/manifest.json`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Self-hosted Umami, served under /stats on the same domain. The tracker
  // derives its collect endpoint (/stats/api/send) from this script's src.
  // Empty id (no website created yet) → skip the script entirely.
  const umamiWebsiteId = process.env.CLIENT_UMAMI_WEBSITE_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ClientEnv />
        {umamiWebsiteId ? (
          <Script
            src="/stats/script.js"
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body
        className={`${onest.className} ${anuphan.variable} ${boon.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactScan />
          <Suspense>
            <Toaster richColors />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
