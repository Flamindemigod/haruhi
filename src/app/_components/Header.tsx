import cx from "classix";
import Image from "next/image";
import { SignIn } from "./SignIn";
import { getServerAuthSession } from "~/server/auth";
import Avatar from "./Avatar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";

export const Header = async () => {
  const session = await getServerAuthSession();
  return (
    <header
      className={cx(
        "flex flex-row items-center justify-between py-4",
        "animate-bg-travel-y bg-500% bg-gradient-to-bl from-primary-500 via-indigo-500 to-primary-500 ",
      )}
    >
      {/* Logo */}
      <Link href={"/"} className="flex flex-row items-center px-2">
        <Image
          alt="Haruhi Logo"
          src={"./Logo.png"}
          height={56}
          width={56}
          priority
        />
      </Link>

      <div className="flex flex-row items-center gap-4 px-2">
        <ThemeSwitcher />
        {/* Sign In Button / User Avatar */}
        {!session?.user ? <SignIn /> : <Avatar />}
      </div>
    </header>
  );
};
