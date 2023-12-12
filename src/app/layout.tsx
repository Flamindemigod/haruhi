import "~/styles/globals.css";
import "@radix-ui/themes/styles.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import ThemeWrapper from "./_components/ThemeWrapper";
import { Theme } from "@radix-ui/themes";
import genMeta from "./utils/genMeta";
import { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeWrapper>
            <Theme
              accentColor="pink"
              panelBackground="translucent"
              radius="full"
              scaling="90%"
            >
              <header></header>
              <nav></nav>
              {children}
              <footer></footer>
            </Theme>
          </ThemeWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
