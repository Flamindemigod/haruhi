import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Background from "./_components/Background";
import Hero from "./_components/Hero";
import Trending from "./_components/Trending/Trending";

export default async function Home() {
  const sesh = await getServerAuthSession();
  return (
    <>
      <Background
        classes="fixed inset-0"
        backgroundImage="/haruhiHomeBg.webp"
      />
      <div className="relative flex w-full flex-col gap-2">
        <Hero />
        {!!sesh?.user ? <>Home/Recommended</> : <Trending />}
        {`Hello There ${sesh?.user.name}`}
        {/* <Activity /> */}
      </div>
    </>
  );
}
