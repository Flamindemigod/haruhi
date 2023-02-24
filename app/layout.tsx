import "./globals.css";
import { UserContextProvider } from "./UserContext";

import QueryProvider from "./QueryProvider";
import Footer from "./Footer";

import Header from "./Header";
import Image from "next/image";
import AnalyticsWrapper from "./AnalyticsWrapper";
import FixLoading from "./FixLoading";

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
      <body className="bg-gray-100 dark:bg-offWhite-700 relative">
        <QueryProvider>
          <UserContextProvider>
            <div className="flex flex-col overflow-x-hidden min-h-screen">
              <header className=" ">
                <Header />
              </header>
              <main className="flex items-center w-full flex-grow ">
                {children}
              </main>
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
