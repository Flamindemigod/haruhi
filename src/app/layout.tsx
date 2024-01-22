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
import { mediaStyle } from "./utils/Media";
import MediaWrapper from "./_components/MediaWrapper";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CardProvider } from "./_components/Card";

export const viewport: Viewport = {
  themeColor: "#cc006d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = genMeta({});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesh = await getServerAuthSession();
  if (!!sesh?.user) {
    await api.user.refreshUser.mutate();
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{ __html: mediaStyle }}
        />
      </head>
      <body className="relative font-sans">
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionWrapper>
            <MediaWrapper>
              <ThemeWrapper>
                <CardProvider>
                  <Theme
                    accentColor="pink"
                    panelBackground="translucent"
                    radius="large"
                    scaling="90%"
                  >
                    <div className="flex min-h-screen flex-col overflow-x-hidden md:max-h-[calc(100dvh_-_4rem)]">
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
                    <div className="sticky bottom-0 h-fit">
                      <div id={"nav-top-panel"}></div>
                      {/* Reserved for Mobile Navigation */}
                      <div className="relative" id={"bot-navigation"}></div>
                    </div>
                  </Theme>
                </CardProvider>
              </ThemeWrapper>
            </MediaWrapper>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
