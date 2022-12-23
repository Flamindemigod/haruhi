import DefaultTags from "../../DefaultTags";

export default async function Head({ params }: { params: { slug: string } }) {
  const data = await fetch(
    `https://haruhi.flamindemigod.com/api/getStaff?id=${params.slug}`
  ).then((res) => res.json());
  return (
    <>
      <DefaultTags />
      <title>{data.data.Staff.name.userPreferred}</title>
      <meta property="og:title" content={data.data.Staff.name.userPreferred} />
      <meta name="description" content={data.data.Staff.description} />
      <meta property="og:description" content={data.data.Staff.description} />
      <meta property="og:image" content={data.data.Staff.image.large} />
    </>
  );
}
