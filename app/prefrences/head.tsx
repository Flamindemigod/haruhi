import DefaultTags from "../DefaultTags";

export default async function Head() {
  return (
    <>
      <DefaultTags />
      <title>Haruhi - Prefrences</title>
      <meta property="og:title" content="Haruhi - Prefrences" />
      <meta
        name="description"
        content={
          "Set your User Prefrences for how haruhi interacts with your Anilist. You need to be logged in to use this."
        }
      />
      <meta
        property="og:description"
        content={
          "Set your User Prefrences for how haruhi interacts with your Anilist. You need to be logged in to use this."
        }
      />
      <meta property="og:image" content="/haruhiHomeBg.webp" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
