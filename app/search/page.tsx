
import genMeta from "../../utils/genMeta";
import { PageInner } from "./page_inner";


export const metadata = genMeta({title: "Haruhi - Search", description: "Search for any Anime, Manga, Character or Staff you can think of"});


const Page = () => {
  return <PageInner />
};

export default Page;
