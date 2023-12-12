import Link from "next/link";
import { Theme } from '@radix-ui/themes';
import { getServerAuthSession } from "~/server/auth";
import ThemeWrapper from "./_components/ThemeWrapper";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="h-screen">
     <ThemeWrapper>
      <Theme accentColor="pink" panelBackground="translucent" radius="full" scaling="90%">
        <div>Hello there</div>
          <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
      </Theme>
      </ThemeWrapper>
    </main>
  );
}


