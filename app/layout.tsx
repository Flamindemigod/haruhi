import "./globals.css";
import { UserContextProvider } from "./UserContext";

import QueryProvider from "./QueryProvider";
import Footer from "./Footer";

import Header from "./Header";
import Image from "next/image";
import AnalyticsWrapper from "./AnalyticsWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="dark:bg-gray-700 relative">
        <QueryProvider>
          <UserContextProvider>
            <div className="fixed w-screen h-screen  -z-50">
              <Image
                src={"/haruhiHomeBg.webp"}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                alt={""}
              />
            </div>
            <div className="flex flex-col overflow-x-hidden min-h-screen">
              <header className=" ">
                <Header />
              </header>
              <main className="flex flex-grow ">{children}</main>
              <footer className="">
                <Footer />
              </footer>
            </div>
            <AnalyticsWrapper />
          </UserContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
