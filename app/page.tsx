import Current from "../components/Home/Current";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import Hero from "./Hero";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-2">
      <Hero />
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
