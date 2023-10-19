
import genMeta from "../../utils/genMeta";
import { PageInner } from "./page_inner";


export const metadata = genMeta({title: "Haruhi - Manga Lists", description: "View your Manga List. You need to be logged in to use this."});


const Page = () => {
  return <PageInner /> 
};

export default Page;
