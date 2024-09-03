import type { Metadata } from "next";
import { Lato } from "next/font/google";

import { Toaster } from "sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { ConvexClientProvider } from "@/components/convex-provider";
import JotaiProvider from "@/components/jotai-provider";
import Models from "@/components/models";

import "./globals.css";

const inter = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slack",
  description: "Chat with your team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <Models />
            <JotaiProvider>
              {children}
              <Toaster />
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
