
import { Metadata, ResolvingMetadata } from "next";
import genMeta from "../../../utils/genMeta";
import { PageInner } from "./page_inner";

type Params = {
  slug: string;
};

export async function generateMetadata(
  {params}: {params: Params},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/getCharacter?id=${params.slug}`
    ).then((res) => res.json());
  return genMeta({title: data.data.Character.name.userPreferred, description: data.data.Character.description, image: data.data.Character.image.large});
}

const Page = ( {params}: {params: Params}) => {
 return <PageInner slug={params.slug}/>
};

export default Page;
