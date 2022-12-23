import DefaultTags from "./DefaultTags";

export default function Head() {
  return (
    <>
      <DefaultTags />
      <title>Haruhi</title>
      <meta property="og:title" content="Haruhi" />
      <meta
        name="description"
        content="Haruhi is a Free and Robust Anime and Manga Streaming platform built using NextJS with built-in Anilist integration, so it tracks your anime and manga for you. Made for you with love by Flamindemigod"
      />
      <meta
        property="og:description"
        content="Haruhi is a Free and Robust Anime and Manga Streaming platform built using NextJS with built-in Anilist integration, so it tracks your anime and manga for you. Made for you with love by Flamindemigod"
      />
      <meta property="og:image" content="/haruhiHomeBg.webp" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
