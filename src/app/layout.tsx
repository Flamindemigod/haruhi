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
import Footer from "./_components/Footer";

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
      <body className="relative  font-sans">
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionWrapper>
            <ThemeWrapper>
              <Theme
                accentColor="pink"
                panelBackground="translucent"
                radius="large"
                scaling="90%"
              >
                <div className="flex min-h-screen flex-col overflow-x-hidden">
                  <div>
                    <Header />
                  </div>
                  <main className="relative flex w-full flex-grow">
                    {children}
                  </main>
                  <div className="">
                    <Footer />
                  </div>
                </div>
              </Theme>
            </ThemeWrapper>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
