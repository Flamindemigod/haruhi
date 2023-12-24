import { RedirectType, redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import SearchResultAnime from "../_components/SearchResult.Anime";
import { MediaSort } from "~/__generated__/graphql";
import HoverCard from "~/primitives/HoverCard";

export default async () => {
  const sesh = await getServerAuthSession();
  if (!sesh?.user) {
    redirect("/", RedirectType.replace);
  }
  const data = await api.anilist.getTrendingAnime.query({
    seasonal: false,
    sort: MediaSort.TrendingDesc,
  });
  return (
    <div className="flex flex-col gap-2 p-2">
      {data?.Page.data.map((d) => (
        <HoverCard
          key={d.id}
          trigger={
            <div>
              <img src={d.coverImage.large} />
            </div>
          }
          // openDelay={0}
          // closeDelay={300}
          portal={{}}
          content={{
            side: "right",
            sideOffset: 5,
            data: (
              <div className="rounded-md bg-blue-500">
                <div dangerouslySetInnerHTML={{ __html: d.description! }} />
              </div>
            ),
          }}
        />
        // <SearchResultAnime media={d as any} key={d.id} />
      ))}
    </div>
  );
};
