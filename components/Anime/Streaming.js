import { FormControlLabel, FormGroup, Switch, IconButton, Select, FormControl, InputLabel, MenuItem, Box } from '@mui/material';
import { SkipPrevious, SkipNext } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VIDEOSERVER } from '../../config';
import { median } from '../../median';
import VideoPlayer from './VideoPlayer';
import makeQuery from "../../makeQuery";
import AlertInfo from '../AlertInfo';


const getVideoUrl = async (title, episode) => {
    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    function handleError(error) {
        console.error(error);
    }
    const req =
        `${VIDEOSERVER}/vidcdn/watch/${title}-episode-${episode}`;
    const resp = await fetch(req)
        .then(handleResponse)
        .catch(handleError);
    return resp;
};

const Streaming = ({ anime, videoId, refresh }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [windowLoaded, setWindowLoaded] = useState(false);
    const user = useSelector(state => state.user.value)
    const [videoURL, setVideoURL] = useState("");
    const [episode, setEpisode] = useState(0);
    const [hasDubbed, setHasDubbed] = useState(false);
    const [isDubbed, setIsDubbed] = useState(user.userPreferenceDubbed);
    const [progress, setProgress] = useState(0);
    const [videoEnd, setVideoEnd] = useState(false);



    const updateEpisode = async (id, episode, status, rewatches = 0) => {
        const query = `
                mutation updateEpisode($id: Int=1, $episode: Int=1, $status: MediaListStatus=CURRENT, $rewatches: Int= 0){
                  SaveMediaListEntry(mediaId: $id, progress:$episode, status:$status, repeat: $rewatches){
                    id
                  }
                }`;
        const variables = {
            id: id,
            episode: episode,
            status: status,
            rewatches: rewatches
        };
        makeQuery(query, variables, user.userToken);
        refresh(); 
    };

    useEffect(() => {
        if (anime.mediaListEntry) {
            setEpisode(median([1, anime.mediaListEntry.progress + 1, anime.nextAiringEpisode ? (anime.nextAiringEpisode.episode - 1) : anime.episodes]))
        }
        else {
            setEpisode(1)
        }
        // eslint-disable-next-line
    }, [videoId])

    useEffect(() => {
        const dubbedList = videoId.filter((el) => {
            if (el.animeId.includes("dub")) { return true }
            return false
        })
        const subbedList = videoId.filter((el) => {
            if (el.animeId.includes("dub")) { return false }
            return true
        })
        if (dubbedList.length) {
            setHasDubbed(true)
        }
        const getVideoURL = async () => {
            const resp = await getVideoUrl(isDubbed ? dubbedList[0].animeId : subbedList[0].animeId, episode)
            if (resp.sources) {
                setVideoURL(await resp.sources[0].file)
            }
        }
        if (episode) { getVideoURL(); }
    }, [episode, isDubbed, videoId])

    useEffect(() => {
        setWindowLoaded(true)
    }, []);

    useEffect(() => {
        if (user.userAuth) {
            if (progress >= user.userPreferenceEpisodeUpdateTreshold && !videoEnd) {
                setVideoEnd(true);
                setAlertOpen(true);
                if (episode === 1) {
                    if (anime.mediaListEntry.status === "COMPLETED") {
                        updateEpisode(anime.id, episode, "CURRENT", anime.mediaListEntry.repeat + 1);

                    }
                    else {
                        updateEpisode(anime.id, episode, "CURRENT", anime.mediaListEntry.repeat);

                    }
                }
                if (episode === anime.episodes) {
                    if (episode === 1) {
                        updateEpisode(anime.id, episode, "COMPLETED", anime.mediaListEntry.repeat + 1);
                    }
                    else {
                        updateEpisode(anime.id, episode, "COMPLETED", anime.mediaListEntry.repeat);
                    }
                }
                else {
                    updateEpisode(anime.id, episode, "CURRENT", anime.mediaListEntry.repeat);
                }


            }
        }
    }, [progress])
    return (
        <div>
            <div className='text-xl'>Streaming</div>
            {windowLoaded && <VideoPlayer
                setVideoEnd={setVideoEnd}
                setProgress={setProgress}
                onReady={() => { setVideoEnd(false) }}
                url={videoURL}
                hasNextEpisode={(episode === (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : anime.episodes)) ? false : true}
                onNextEpisode={() => { setEpisode(state => state + 1) }} />}
            <div className="flex flex-col sm:flex-row w-full justify-between items-center">
                {/* Empty Div to help position */}
                <Box sx={{ width: "10rem" }}></Box>
                {/* Episode Selector */}
                <div className="flex flex-row justify-center ">
                    <IconButton
                        aria-label="Previous Episode"
                        disabled={(episode === 1) ? true : false}
                        onClick={() => {
                            setEpisode(state => state - 1);
                        }}
                    >
                        <SkipPrevious />
                    </IconButton>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="episodeSelectorLabel">Playing Episode</InputLabel>
                        <Select
                            MenuProps={{
                                disableScrollLock: true,
                            }}
                            labelId="episodeSelectorLabel"
                            id="episodeSelector"
                            value={episode}
                            label="Episode"
                            onChange={(e) => {
                                setEpisode(e.target.value);
                            }}
                        >
                            {Array.from({ length: (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : anime.episodes) }, (_, i) => i + 1).map(
                                (_episode) => (
                                    <MenuItem key={_episode} value={_episode}>{`${_episode}`}</MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                    <IconButton
                        aria-label="Next Episode"
                        disabled={episode === (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : anime.episodes) ? true : false}
                        onClick={() => {
                            setEpisode(state => state + 1);
                        }}
                    >
                        <SkipNext />
                    </IconButton>
                </div>
                {/* Dubbed Selector */}
                <FormGroup sx={{ width: "10rem" }}>
                    <FormControlLabel disabled={!hasDubbed} control={<Switch checked={isDubbed} onChange={() => { setIsDubbed(state => !state) }} />} label={isDubbed ? "Dubbed" : "Subbed"} />
                </FormGroup>
            </div>
            <AlertInfo
                open={alertOpen}
                onClose={() => { setAlertOpen(false) }}
                value="Episode Updated"
            />
        </div>
    )
}

export default Streaming