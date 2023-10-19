
import genMeta from "../../utils/genMeta";
import { PageInner } from "./page_inner";

export const metadata = genMeta({title: "Haruhi - Seasonal", description: "View Seasonal Anime for the current airing year"});

const Page = () => {
 return <PageInner /> 
};

export default Page;
