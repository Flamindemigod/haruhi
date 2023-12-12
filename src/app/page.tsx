import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const sesh = await getServerAuthSession();
  var user = await api.user.getUser.query();
  if (!!sesh?.user) {
    await api.user.refreshUser.mutate();
  }
  return (
    <main className="h-screen">
      <div>Hello there {JSON.stringify(sesh?.user)}</div>
    </main>
  );
}
