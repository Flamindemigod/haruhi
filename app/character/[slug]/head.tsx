import DefaultTags from "../../DefaultTags";

export default async function Head({ params }: { params: { slug: string } }) {
  const data = await fetch(
    `${process.env.NEXT_SERVER}/api/getCharacter?id=${params.slug}`
  ).then((res) => res.json());
  return (
    <>
      <DefaultTags />
      <title>{data.data.Character.name.userPreferred}</title>
      <meta
        property="og:title"
        content={data.data.Character.name.userPreferred}
      />
      <meta name="description" content={data.data.Character.description} />
      <meta
        property="og:description"
        content={data.data.Character.description}
      />
      <meta property="og:image" content={data.data.Character.image.large} />
    </>
  );
}
