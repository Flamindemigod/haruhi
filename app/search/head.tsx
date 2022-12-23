import DefaultTags from "../DefaultTags";

export default async function Head() {
  return (
    <>
      <DefaultTags />
      <title>Haruhi - Search</title>
      <meta property="og:title" content="Haruhi - Search" />
      <meta
        name="description"
        content={
          "Search for any Anime, Manga, Character or Staff you can think of"
        }
      />
      <meta
        property="og:description"
        content={
          "Search for any Anime, Manga, Character or Staff you can think of"
        }
      />
      <meta property="og:image" content="/haruhiHomeBg.webp" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
