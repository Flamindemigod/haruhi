
import genMeta from "../../utils/genMeta";
import { PageInner } from "./page_inner";

export const metadata = genMeta({title: "Haruhi - Prefrences", description: "Set your User Prefrences for how haruhi interacts with your Anilist. You need to be logged in to use this."});

const Page = () => {
 return <PageInner />
};

export default Page;
