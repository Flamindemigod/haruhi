import { PageInner } from "./page_inner";
import { Metadata, ResolvingMetadata } from "next";
import genMeta from "../../../utils/genMeta";
type Params = {
  slug: String
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/getStudio?id=${params.slug}`
  ).then((res) => res.json());
  return genMeta({title: data.data.Studio.name, description: ""});
}


const Page = ({ params }: { params: Params }) => {
 return <PageInner slug={params.slug}/>
};

export default Page;
