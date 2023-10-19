import genMeta from "../../utils/genMeta";
import { PageInner } from "./page_inner";

export const metadata = genMeta({title: "Haruhi - Anime Lists", description: "View your Anime List. You need to be logged in to use this."});

const Page = () => {
  return <PageInner />
};

export default Page;
