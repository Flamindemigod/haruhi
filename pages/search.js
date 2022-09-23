import { FormControl, InputBase, Autocomplete, TextField, FormControlLabel, Checkbox, Box, useMediaQuery } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../features/loading';
import { styled, alpha } from '@mui/material/styles';
import makeQuery from '../makeQuery';
import Chip from '@mui/material/Chip';
import Meta from "../components/Meta";
import { SERVER } from '../config';
import Card from "../components/Card"
import { AnimatePresence } from 'framer-motion';

const SearchInput = styled(InputBase)(({ theme }) => ({
    '&': { width: "100%", height: "100%" },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        transition: theme.transitions.create([
            'box-shadow',
        ]),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

const AdvancedSearch = () => {
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch();
    const hasHover = useMediaQuery("(hover:hover)");
    const searchGrid = useRef();

    const [searchGridColumnCount, setSearchGridColumnCount] = useState(1)

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const [genreWhitelist, setGenreWhitelist] = useState([]);
    const [genreBlacklist, setGenreBlacklist] = useState([]);
    const [genreCollection, setGenreCollection] = useState([]);

    const [tagWhitelist, setTagWhitelist] = useState([]);
    const [tagBlacklist, setTagBlacklist] = useState([]);
    const [tagCollection, setTagCollection] = useState([]);

    const [season, setSeason] = useState(null);
    const [seasonYear, setSeasonYear] = useState(null);

    const [format, setFormat] = useState(null);
    const [status, setStatus] = useState(null);

    const [isAdult, setIsAdult] = useState(false);
    const [onList, setOnList] = useState(false);

    useEffect(() => {
        const getSearchResults = async () => {
            const query = `query Search($page:Int, ${searchQuery ? "$searchQuery: String" : ""}, $sort:[MediaSort] = [POPULARITY_DESC], ${season ? "$season:MediaSeason" : ""}, ${seasonYear ? "$seasonYear:Int" : ""}, ${status ? "$status:MediaStatus" : ""}, $isAdult:Boolean = false, ${format ? "$format:MediaFormat" : ""}, ${genreWhitelist.length ? "$genreIn:[String]" : ""},${genreBlacklist.length ? "$genreNotIn:[String]" : ""}, ${tagWhitelist.length ? "$tagIn:[String]" : ""},${tagBlacklist.length ? "$tagNotIn:[String]" : ""}, ${onList ? "$onList: Boolean" : ""} ) {
            Page(perPage: 25, page:$page) {
              pageInfo{
                hasNextPage
              }
              media(${searchQuery ? "search: $searchQuery" : ""}, type: ANIME, sort: $sort, ${season ? "season: $season" : ""}, ${seasonYear ? "seasonYear: $seasonYear" : ""}, ${status ? "status: $status" : ""}, isAdult: $isAdult, ${format ? "format: $format" : ""}, ${genreWhitelist.length ? "genre_in: $genreIn" : ""},${genreBlacklist.length ? "genre_not_in:$genreNotIn" : ""}, ${tagWhitelist.length ? "tag_in:$tagIn" : ""}, ${tagBlacklist.length ? "tag_not_in:$tagNotIn" : ""},${onList ? "onList:$onList" : ""} ) {
                id
                title {
                  userPreferred
                }
                coverImage {
                  large
                }
                status
              }
            }
          }`
            const variables = {
                searchQuery,
                genreIn: genreWhitelist,
                genreNotIn: genreBlacklist,
                tagIn: tagWhitelist.map((tag) => (tag.name)),
                tagNotIn: tagBlacklist.map((tag) => (tag.name)),
                season,
                seasonYear,
                status,
                format,
                onList,
                isAdult,
                page: 1

            };
            let dataArray = []
            let hasNextPage = true

            while (hasNextPage) {
                const data = await makeQuery(query, variables, user.userToken);
                if (!data) { return null }
                dataArray = [...dataArray, ...data.data.Page.media]
                if ((!data.data.Page.pageInfo.hasNextPage) || (variables.page === 5)) {
                    hasNextPage = false
                }
                else {
                    variables.page += 1;
                }
            }

            setSearchResult(dataArray)
        }
        getSearchResults();
    }, [searchQuery, genreWhitelist, genreBlacklist, tagWhitelist, tagBlacklist, season, seasonYear, format, status, onList, isAdult])

    useEffect(() => {
        const getCollection = async () => {
            const query = `query{
            GenreCollection
            MediaTagCollection {
              name
              category
            }
          }`
            const genres = await makeQuery(query, {})
            setGenreCollection(genres.data.GenreCollection);
            setTagCollection(genres.data.MediaTagCollection.sort((a, b) => {
                const categoryA = a.category.toUpperCase(); // ignore upper and lowercase
                const categoryB = b.category.toUpperCase(); // ignore upper and lowercase
                if (categoryA < categoryB) {
                    return -1;
                }
                if (categoryA > categoryB) {
                    return 1;
                }

                // names must be equal
                return 0;
            }));
        }
        getCollection();
    }, [])

    useEffect(() => {
        dispatch(setLoading(false));
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const gridComputedStyle = window.getComputedStyle(searchGrid.current);
            // get number of grid columns
            const gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
            setSearchGridColumnCount(gridColumnCount)
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return (() => { window.removeEventListener("resize", handleResize) })
    }, [])

    return (
        <div>
            <Meta
                title="Haruhi - Search"
                description="Search for anime in the Anilist Database"
                url={`${SERVER}/search`} />
            <div className='flex flex-col w-11/12 mx-auto p-8'>
                <div className='flex w-11/12 mx-auto py-8 items-center'>
                    <SearchInput sx={{ "input": { height: "5rem", fontSize: "2rem" } }} placeholder="Search..." variant='standard' onChange={(e) => { setSearchQuery(e.target.value) }} ></SearchInput>
                    <Search sx={{ mr: 1, my: 0.5 }} />
                </div>
                <div className='flex flex-wrap justify-center items-center'>

                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            options={["SPRING", "SUMMER", "FALL", "WINTER"]}
                            value={season}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Season" />}

                            onChange={(event, values) => { setSeason(values) }}
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            options={Array.from(Array(new Date().getUTCFullYear() - 1938).keys()).map(i => i + 1940).sort((a, b) => (b - a))}
                            value={seasonYear}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Season Year" />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        color="primary"
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            onChange={(event, values) => { setSeasonYear(values) }}
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            options={["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"]}
                            value={format}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Format" />}
                            onChange={(event, values) => { setFormat(values) }}
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            options={["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"]}
                            value={status}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Airing Status" />}
                            onChange={(event, values) => { setStatus(values) }}
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            multiple={true}
                            options={genreCollection}
                            value={genreWhitelist}
                            onChange={(event, values) => {
                                setGenreWhitelist(values);
                            }}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Genres" />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        color="primary"
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete

                            disablePortal
                            multiple={true}
                            options={genreCollection}
                            value={genreBlacklist}
                            onChange={
                                (event, values) => { setGenreBlacklist(values) }
                            }
                            getOptionLabel={(option) => option}
                            renderInput={(params) => <TextField {...params} label="Genre Blacklist" />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        color="secondary"
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        ></Autocomplete>


                    </FormControl>
                    {/* Tags */}
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                            disablePortal
                            multiple={true}
                            groupBy={(option) => option.category}
                            options={tagCollection}
                            value={tagWhitelist}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Tags" />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option.name}
                                        color="primary"
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            onChange={(event, values) => { setTagWhitelist(values) }}
                        ></Autocomplete>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete

                            disablePortal
                            multiple={true}
                            groupBy={(option) => option.category}
                            options={tagCollection}
                            value={tagBlacklist}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Tags Blacklist" />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option.name}
                                        color="secondary"
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            onChange={(event, values) => { setTagBlacklist(values) }}
                        ></Autocomplete>
                    </FormControl>

                </div>
                <div className="ml-auto">
                    <FormControl disabled={!user.userAuth} sx={{ justifySelf: "end" }}>
                        <FormControlLabel
                            control={<Checkbox checked={onList} onChange={(e) => { setOnList(e.target.checked) }} />}
                            label="Is on List" />
                    </FormControl>
                    <FormControl disabled={!user.userAuth}>
                        <FormControlLabel
                            control={<Checkbox checked={isAdult} onChange={(e) => { setIsAdult(e.target.checked) }} />}
                            label="Is Adult" />
                    </FormControl>
                </div>
            </div>
            <div className="flex justify-center items-center ">
                <Box ref={searchGrid} className={`search--grid | grid justify-center gap-4 w-max ${hasHover ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                    <AnimatePresence>
                        {searchResult.map((media, index) => (
                            <Card height={168} width={128} key={media.id} link={`/anime/${media.id}`} image={media.coverImage.large} title={media.title.userPreferred} status={media.status} changeDirection={(index % searchGridColumnCount >= searchGridColumnCount - 2 && index > 2) ? true : false} />
                        ))}
                    </AnimatePresence>
                </Box>
            </div>
        </div>
    )
}

export default AdvancedSearch