import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Meta from "../../components/Meta"
import { Box, Tab, useMediaQuery } from "@mui/material"
import { TabPanel, TabContext, TabList } from "@mui/lab"
import { SERVER } from "../../config"
import { setLoading } from "../../features/loading"
import List from "../../components/Lists/List"

const AnimeList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.value)
    const [tabIndex, setTabIndex] = useState("1");

    const handleChange = (event, newtabIndex) => {
        setTabIndex(newtabIndex);
    };

    useEffect(() => {
        dispatch(setLoading(false))
    }, [])
    return (
        <>
            <Meta
                title="Haruhi - Anime List"
                description={user.userAuth ? `${user.userName}'s Anime Lists` : "You need to be logged in to see this page"}
                url={`${SERVER}/anime`} />

            {user.userAuth ?
                <Box className="w-full text-xl">
                    <TabContext value={tabIndex}>
                        <Box>
                            <TabList sx={{ "& .MuiTabs-scroller": { marginInline: "auto" }, "& .MuiTabs-flexContainerVertical": { width: "max-content", marginInline: "auto" } }} orientation={!useMediaQuery('(min-width:600px)') ? 'vertical' : "horizontal"} onChange={handleChange} centered>
                                <Tab label="Currently Watching" value="1" />
                                <Tab label="On Hold" value="2" />
                                <Tab label="Planning" value="3" />
                                <Tab label="Completed" value="4" />
                                <Tab label="Dropped" value="5" />

                            </TabList>
                        </Box>

                        <TabPanel sx={{ padding: 0 }} value="1" ><List status={"CURRENT"} /></TabPanel>

                        <TabPanel sx={{ padding: 0 }} value="2" ><List status={"PAUSED"} /></TabPanel>

                        <TabPanel sx={{ padding: 0 }} value="3" ><List status={"PLANNING"} /></TabPanel>

                        <TabPanel sx={{ padding: 0 }} value="4" ><List status={"COMPLETED"} /></TabPanel>

                        <TabPanel sx={{ padding: 0 }} value="5" ><List status={"DROPPED"} /></TabPanel>
                    </TabContext>

                </Box>
                :
                <div className="text-xl my-auto">You need to be logged in to see this page</div>}
        </>
    )
}

export async function getServerSideProps() {
    return {
        props: {}
    }
}

export default AnimeList