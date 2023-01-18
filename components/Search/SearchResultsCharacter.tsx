"use client";

import { Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import HoverCard from "../../primitives/Card";
import Image from "next/image";
import Link from "next/link";
import useDebounce from "../../utils/useDebounce";
type Props = {
  searchString: string;
  sort: string;
  filters: any;
};

const SearchResultsCharacter = (props: Props) => {
  const debouncedFilter = useDebounce(props.filters, 1000);
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      "characterSearch",
      props.searchString,
      props.sort,
      debouncedFilter,
    ],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER
        }/api/getSearchResultsAdvanced?page=${pageParam}&type=CHARACTER&sort=${
          !!props.searchString || props.sort !== "SEARCH_MATCH"
            ? props.sort
            : "FAVOURITES_DESC"
        }${!!props.searchString ? `&search=${props.searchString}` : ""}${
          debouncedFilter.isBirthday !== undefined
            ? `&isBirthday=${debouncedFilter.isBirthday}`
            : ""
        }`
      );
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.Page.pageInfo.hasNextPage
        ? lastPage.Page.pageInfo.currentPage + 1
        : false;
    },
  });
  return (
    <>
      {data?.pages.map((page: any, index: number) => (
        <Fragment key={index}>
          {page.Page.characters.map((character: any) => (
            <HoverCard
              key={character.id}
              cardDirection="bottom"
              Trigger={
                <Link href={`/character/${character.id}`}>
                  <div className="relative" style={{ width: 156, height: 220 }}>
                    <Image
                      src={character.image.large}
                      fill
                      sizes="20vw"
                      className={"object-cover"}
                      alt={character.name.userPreferred}
                    />
                  </div>
                  <h3
                    className="text-sm overflow-hidden whitespace-nowrap text-black dark:text-offWhite-100"
                    style={{
                      width: 156,
                      height: 20,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {character.name.userPreferred}
                  </h3>
                </Link>
              }
              Card={
                <div className="text-black dark:text-offWhite-100">
                  <div>
                    <h3 className="text-xl ">{character.name.userPreferred}</h3>
                    <h2 className="text-sm ">
                      {character.name.alternative.map(
                        (name: string) => `| ${name} |`
                      )}
                    </h2>
                  </div>
                  <div
                    className="card--description"
                    dangerouslySetInnerHTML={{
                      __html: character.description,
                    }}
                  />
                </div>
              }
            />
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <button
          className="btn | flex justify-center items-center bg-primary-500 col-span-full "
          onClick={() => {
            fetchNextPage();
          }}
        >
          Load More...
        </button>
      )}
    </>
  );
};

export default SearchResultsCharacter;
