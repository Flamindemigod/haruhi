import Link from "next/link";
import { Theme, ThemePanel } from '@radix-ui/themes';
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import ThemeWrapper from "./_components/ThemeWrapper";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="h-screen">
     <ThemeWrapper>
      <Theme accentColor="pink" panelBackground="translucent" radius="full" scaling="90%">
        <div>Hello there</div>
        <ThemePanel />
      </Theme>
      </ThemeWrapper>
    </main>
  );
}


