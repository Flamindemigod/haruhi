import DefaultTags from "../../DefaultTags";
export default async function Head({ params }: { params: { slug: string } }) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/getEntry?id=${params.slug}`
  ).then((res) => res.json());
  return (
    <>
      <DefaultTags />
      <title>{data.data.Media.title.userPreferred}</title>
      <meta property="og:title" content={data.data.Media.title.userPreferred} />
      <meta name="description" content={data.data.Media.description} />
      <meta property="og:description" content={data.data.Media.description} />
      <meta property="og:image" content={data.data.Media.coverImage.large} />
    </>
  );
}
