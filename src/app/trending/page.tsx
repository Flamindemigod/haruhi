import { RedirectType, redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Trending from "../_components/Trending/Trending";

export default async () => {
  const sesh = await getServerAuthSession();
  if (!sesh?.user) {
    redirect("/", RedirectType.replace);
  }

  return <Trending />;
};
