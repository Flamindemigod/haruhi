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

const SearchResultsStaff = (props: Props) => {
  const debouncedFilter = useDebounce(props.filters, 1000);
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["staffSearch", props.searchString, props.sort, debouncedFilter],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER
        }/api/getSearchResultsAdvanced?page=${pageParam}&type=STAFF&sort=${
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
          {page.Page.staff.map((staff: any) => (
            <HoverCard
              key={staff.id}
              cardDirection="bottom"
              Trigger={
                <Link href={`/staff/${staff.id}`}>
                  <div className="relative" style={{ width: 156, height: 220 }}>
                    <Image
                      src={staff.image.large}
                      fill
                      sizes="20vw"
                      className={"object-cover"}
                      alt={staff.name.userPreferred}
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
                    {staff.name.userPreferred}
                  </h3>
                </Link>
              }
              Card={
                <div className="text-black dark:text-offWhite-100">
                  <div>
                    <h3 className="text-xl ">{staff.name.userPreferred}</h3>
                    <h2 className="text-sm ">
                      {staff.name.alternative.map(
                        (name: string) => `| ${name} |`
                      )}
                    </h2>
                  </div>
                  <div
                    className="card--description"
                    dangerouslySetInnerHTML={{
                      __html: staff.description,
                    }}
                  />
                  <div style={{ marginTop: "2rem" }}>
                    {staff.languageV2}
                    {" - "}
                    {staff.primaryOccupations?.map(
                      (occupation: string, index: number) => (
                        <span key={index}>| {occupation} |</span>
                      )
                    )}
                  </div>
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

export default SearchResultsStaff;
