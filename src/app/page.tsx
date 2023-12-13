import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Background from "./_components/Background";
import Hero from "./_components/Hero";

export default async function Home() {
  // const sesh = await getServerAuthSession();
  // var user = await api.user.getUser.query();
  // if (!!sesh?.user) {
  // await api.user.refreshUser.mutate();
  // }
  return (
    <>
      <Background
        classes="fixed inset-0"
        backgroundImage="/haruhiHomeBg.webp"
      />
      <div className="relative flex w-full flex-col gap-2">
        <Hero />
        {/* <Activity /> */}
      </div>
    </>
  );
}
