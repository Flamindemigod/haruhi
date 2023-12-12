import "~/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import ThemeWrapper from "./_components/ThemeWrapper";
import { Theme } from "@radix-ui/themes";
import genMeta from "./utils/genMeta";
import { Viewport } from "next";
import { Header } from "./_components/Header";
import SessionWrapper from "./_components/SessionWrapper";

export const viewport: Viewport = {
  themeColor: "#cc006d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = genMeta({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionWrapper>
            <ThemeWrapper>
              <Theme
                accentColor="pink"
                panelBackground="translucent"
                radius="large"
                scaling="90%"
              >
                <Header />
                <nav></nav>
                {children}
                <footer></footer>
              </Theme>
            </ThemeWrapper>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
