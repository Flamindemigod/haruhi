import DefaultTags from "../DefaultTags";

export default async function Head() {
  return (
    <>
      <DefaultTags />
      <title>Haruhi - Manga Lists</title>
      <meta property="og:title" content="Haruhi - Manga Lists" />
      <meta
        name="description"
        content={"View your Manga List. You need to be logged in to use this."}
      />
      <meta
        property="og:description"
        content={"View your Manga List. You need to be logged in to use this."}
      />
      <meta property="og:image" content="/haruhiHomeBg.webp" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
