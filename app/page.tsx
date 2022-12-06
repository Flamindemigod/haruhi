import Current from "../components/Home/Current";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import Hero from "../components/Home/Hero";
import Activity from "../components/Home/Activity";

export default function Home() {
  return (
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
      <Trending type="ANIME" />
      <Trending type="MANGA" />
    </div>
  );
}
