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
                  <div
                    className="fixed bottom-0 left-0 right-0 h-fit"
                    id={"bot-navigation"}
                  >
                    {/* Reserved for Mobile Navigation */}
                  </div>
                </Theme>
              </ThemeWrapper>
            </MediaWrapper>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
