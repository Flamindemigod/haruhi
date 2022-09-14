import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import makeQuery from "../../makeQuery";
import { Box } from "@mui/material";
import { ArrowUpward, ArrowDownward, Sort } from "@mui/icons-material";
import Image from "next/image";

const onClickSort = (sort, setter, desc, asc) => {
    if (sort === asc) {
        setter(desc)
    }
    else if (sort === desc) {
        setter("UPDATED_TIME_DESC")
    }
    else {
        setter(asc)
    }
}

const renderSwitch = (param, desc, asc) => {
    switch (param) {
        case desc:
            return <ArrowDownward fontSize="small" />;
        case asc:
            return <ArrowUpward fontSize="small" />;
        default:
            return <Sort fontSize='small' />;
    }
}

const List = ({ status }) => {
    let user = useSelector((state) => state.user.value);
    const [animeList, setAnimeList] = useState([])
    const [sort, setSort] = useState("UPDATED_TIME_DESC")


    useEffect(() => {
        const getAnime = async () => {
            var query = `
                query usersAiringSchedule($perPage: Int = 50, $page: Int = 1, $userName: String, $status:MediaListStatus = CURRENT, $sort:MediaListSort = UPDATED_TIME_DESC) {
                    Page(perPage: $perPage, page: $page) {
                      pageInfo {
                        hasNextPage
                        total
                      }
                      mediaList(userName: $userName, type: ANIME, status: $status, sort: [$sort]) {
                        media {
                          episodes
                          id
                          format
                          status
                          siteUrl
                          averageScore
                          coverImage {
                            large
                          }
                          title {
                            userPreferred
                          }
                          mediaListEntry{
                            id
                            score
                            progress
                          }
                        }
                      }
                    }
                  }
                  
            `;
            var variables = {
                perPage: 50,
                page: 0,
                userName: user.userName,
                status: status,
                sort: sort
            };

            const getList = (data) => {
                const mediaArray = data.data.Page.mediaList;
                var airingArray = [];
                for (const media in mediaArray) {
                    airingArray[media] = mediaArray[media].media;
                }


                return [data.data.Page.pageInfo.hasNextPage, airingArray];
            };
            let hasNextPage = true
            setAnimeList([])

            let data;
            while (hasNextPage) {
                variables["page"] = variables["page"] + 1
                data = await makeQuery(query, variables, user.userToken).then(getList);
                hasNextPage = data[0];
                setAnimeList((state) => (state.concat(data[1])))
            }
        }
        getAnime();
    }, [sort, user])


    return (
        <Box className="flex flex-col " sx={{ width: "100%", marginInline: "auto" }}>
            <div className='flex font-semibold h-32 sm:h-16 w-full gap-4 justify-center items-center bg-offWhite-600'>
                <div className="flex gap-2 items-center object-cover h-full w-2/12"></div>
                <div className="flex gap-2 items-center text-xs sm:text-lg w-7/12 cursor-pointer" onClick={(event) => { onClickSort(sort, setSort, "MEDIA_TITLE_ROMAJI_DESC", "MEDIA_TITLE_ROMAJI") }}>Title {renderSwitch(sort, "MEDIA_TITLE_ROMAJI_DESC", "MEDIA_TITLE_ROMAJI")}</div>
                <div onClick={(event) => { onClickSort(sort, setSort, "SCORE_DESC", "SCORE") }} className="flex gap-2 items-center cursor-pointer text-xs sm:text-lg w-1/12">Score {renderSwitch(sort, "SCORE_DESC", "SCORE")}</div>
                <div className="flex gap-2 items-center text-xs sm:text-lg w-1/12">Type</div>
                <div onClick={(event) => { onClickSort(sort, setSort, "PROGRESS_DESC", "PROGRESS") }} className="flex gap-2 items-center  cursor-pointer text-xs sm:text-lg w-1/12" style={{ minWidth: "3rem" }}>Progress {renderSwitch(sort, "PROGRESS_DESC", "PROGRESS")}</div>


            </div>
            {animeList.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`} className="listLink">
                    <div className='flex h-32 sm:h-16 w-full gap-4 justify-center items-center cursor-pointer'>
                        <Box className="h-full w-2/12 relative">
                            <Image className="object-cover  object-center" layout="fill" src={anime.coverImage.large} alt={`Cover for ${anime.title.userPreferred}`} />
                        </Box>
                        <div className="text-xs overflow-hidden text-ellipsis sm:text-sm w-7/12">{anime.title.userPreferred}</div>
                        <div className="text-xs sm:text-sm w-1/12">{anime.mediaListEntry.score}</div>
                        <div className="text-xs sm:text-sm w-1/12">{anime.format}</div>
                        <div className="text-xs sm:text-sm w-1/12" style={{ minWidth: "3rem" }}>{anime.mediaListEntry ? anime.mediaListEntry.progress : 0} {anime.episodes ? `/ ${anime.episodes}` : "+"}</div>
                    </div>
                </Link>
            ))}
        </Box>
    )
}

export default List