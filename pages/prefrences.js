import { Box, Divider, FormControl, Slider, Select, MenuItem, Switch } from "@mui/material"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "../features/user";
import { setLoading } from "../features/loading"
const Prefrences = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.value);
    useEffect(() => { dispatch(setLoading(false)) }, [])
    return (
        <div className="text-offWhite-100 w-10/12">
            <div className="text-xl">User Prefrences</div>
            <Divider />
            <div className="flex flex-col gap-4 p-4">
                <div className="w-full text-lg p-4 bg-offWhite-600 rounded-lg">Video Prefrences</div>
                <div className="flex flex-col sm:flex-row w-full items-center sm:justify-between gap-2">
                    <div className="w-full">Episode Update Threshold</div>
                    <FormControl fullWidth sx={{ maxWidth: "15rem" }}>
                        <Slider valueLabelDisplay="auto" value={user.userPreferenceEpisodeUpdateTreshold * 100} onChange={(e) => { dispatch(setUser({ userPreferenceEpisodeUpdateTreshold: parseInt(e.target.value) / 100 })) }} />
                    </FormControl>
                </div>
                <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-2">
                    <div className="w-full">
                        <div>Opening Skip Time</div>
                        <div className="text-sm">Setting to 0 removes Button</div>
                    </div>
                    <FormControl fullWidth sx={{ maxWidth: "15rem" }}>
                        <Select
                            value={user.userPreferenceSkipOpening}
                            onChange={(e) => { dispatch(setUser({ userPreferenceSkipOpening: parseInt(e.target.value) })) }}
                            MenuProps={{
                                PaperProps: {
                                    className: "styled-scrollbars",
                                    style: {
                                        width: 100,
                                    },
                                },
                                disableScrollLock: true,
                            }}>
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={80}>80</MenuItem>
                            <MenuItem value={85}>85</MenuItem>
                            <MenuItem value={90}>90</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex flex-row w-full items-center justify-between gap-2">
                    <div>
                        <div>Show End Rating Dialog</div>
                        <div className="text-sm">Presents user with a prompt to rate show after finishing all episodes of it</div>
                        <div className="text-sm">Must be Logged in</div>
                    </div>

                    <FormControl>
                        <Switch checked={user.userPreferenceShowEndDialog} onChange={() => { dispatch(setUser({ userPreferenceShowEndDialog: !user.userPreferenceShowEndDialog })) }} />
                    </FormControl>
                </div>
            </div>

        </div>
    )
}

export default Prefrences