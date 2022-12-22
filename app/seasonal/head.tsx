import getSeason from "../../utils/getSeason";
import DefaultTags from "../DefaultTags";

export default async function Head() {
  const { season, year } = getSeason();
  return (
    <>
      <DefaultTags />
      <title>{`Haruhi - Seasonal`}</title>
      <meta property="og:title" content={`Haruhi - Seasonal`} />
      <meta
        name="description"
        content={"View Seasonal Anime for the current airing year"}
      />
      <meta
        property="og:description"
        content={"View Seasonal Anime for the current airing year"}
      />
      <meta property="og:image" content="/haruhiHomeBg.webp" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
