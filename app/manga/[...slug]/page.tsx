import React from "react";
import Background from "../../../components/Background";
import Image from "next/image";
import Description from "../../../components/Anime-Manga/Description";
import Sidebar from "../../../components/Anime-Manga/Sidebar";
import Characters from "../../../components/Anime-Manga/Characters";
import Relations from "../../../components/Anime-Manga/Relations";
import Recommended from "../../../components/Anime-Manga/Recommended";
import MediaListEditor from "../../../components/Anime-Manga/MediaListEditor";
import Reader from "../../../components/Manga/Reader";
import { cookies } from "next/headers";
type Params = {
  slug: any[];
};

const Page = async ({ params }: { params: Params }) => {
  const nextCookies = cookies();

  const fetchEntry = async () => {
    const data = await fetch(
      `http://136.243.175.33:8080/api/getEntry?id=${params.slug[0]}`,
      {
        headers: {
          cookie: nextCookies.get("access_token")
            ? `access_token=${nextCookies.get("access_token")?.value}`
            : "",
        },
      }
    ).then((res) => res.json());
    return data.data.Media;
  };
  const entryData = await fetchEntry();
  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-2 h-80 w-screen relative isolate ">
        <Background
          classes="col-span-full "
          backgroundImage={entryData.bannerImage}
        />
        <div className="flex gap-4 text-offWhite-100 bg-offWhite-800 bg-opacity-75 row-start-2 self-center col-span-full md:col-span-3 md:col-start-2">
          <div className="flex-shrink-0 overflow-hidden flex items-center">
            <Image
              className="aspect-auto object-contain"
              priority
              width={128}
              height={228}
              placeholder={"blur"}
              src={entryData.coverImage.large}
              blurDataURL={entryData.coverImage.medium}
              alt={`Cover for ${entryData.title.userPreferred}`}
            />
          </div>
          <div className="self-center">
            <div className="text-xl font-semibold">
              {entryData.title.userPreferred}
            </div>
            <div className="text-base">{entryData.title.english}</div>
          </div>
        </div>
      </div>
      <section className="text-offWhite-900 dark:text-offWhite-100">
        <Description text={entryData.description} />
      </section>
      <section>
        <div className="flex flex-col flex-wrap md:flex-row p-4 gap-4">
          <div
            className="flex flex-col gap-4"
            style={{ flex: "1 1 15%", width: "-webkit-fill-available" }}
          >
            <MediaListEditor entry={entryData} />
            <Sidebar anime={entryData} />
          </div>
          {/* Content */}
          <div
            style={{
              flex: "1 1 80%",
              overflow: "hidden",
              width: "-webkit-fill-available",
            }}
          >
            <Characters characters={entryData.characters.edges} />
            <Relations relations={entryData.relations.edges} />
            <Reader entry={entryData} />
            <Recommended recommended={entryData.recommendations.edges} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
