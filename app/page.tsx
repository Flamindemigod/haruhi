import Current from "../components/Home/Current";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import Hero from "../components/Home/Hero";
import Activity from "../components/Home/Activity";
import Background from "../components/Background";
import Popular from "../components/Home/Popular";
import genMeta from "../utils/genMeta";


export const metadata = genMeta({});

export default function Home() {
  return (
    <>
      <Background
        classes="fixed inset-0"
        backgroundImage="/haruhiHomeBg.webp"
      />
      <div className="relative flex flex-col gap-2">
        <div className="relative">
          <Hero />
          {/* @ts-expect-error Server Component */}
          <Activity />
        </div>
        <Current type="ANIME" />
        <Current type="MANGA" />
        <Recommended type="ANIME" />
        <Recommended type="MANGA" />
        <Trending season type="ANIME" />
        <Popular type="ANIME" />
        <Popular type="MANGA" />
      </div>
    </>
  );
}
