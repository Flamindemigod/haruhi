import { RedirectType, redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async () => {
  const sesh = await getServerAuthSession();
  if (!sesh?.user) {
    redirect("/", RedirectType.replace);
  }
};
