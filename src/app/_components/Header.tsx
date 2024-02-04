import cx from "classix";
import Image from "next/image";
import { SignIn } from "./SignIn";
import { getServerAuthSession } from "~/server/auth";
import Avatar from "./Avatar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";
// import {  Navigation } from "./Navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Navigation = dynamic(() => import("./Navigation"), {
  ssr: false,
  loading: () => <div className="w-full" />,
});

export const Header = async () => {
  const session = await getServerAuthSession();
  return (
    <header
      className={cx(
        "flex flex-row items-center justify-between gap-2 px-2 py-4",
        "animate-bg-travel-y bg-gradient-to-bl from-primary-500 via-indigo-500 to-primary-500 bg-500%",
      )}
    >
      {/* Logo */}
      <Link href={"/"} className="flex flex-shrink-0 flex-row items-center">
        <Image
          alt="Haruhi Logo"
          src={"/Logo.png"}
          height={56}
          width={56}
          priority
        />
      </Link>
      <Navigation isUserAuth={!!session?.user} />
      {/* Theme Switcher */}
      <ThemeSwitcher />
      {/* Sign In Button / User Avatar */}
      {!session?.user ? <SignIn /> : <Avatar />}
    </header>
  );
};
