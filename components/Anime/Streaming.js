import { FormControlLabel, FormGroup, Switch, IconButton, Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { SkipPrevious, SkipNext } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VIDEOSERVER } from '../../config';
import { median } from '../../median';
import VideoPlayer from './VideoPlayer';

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

const Streaming = ({ anime, videoId }) => {
    const [windowLoaded, setWindowLoaded] = useState(false);
    const user = useSelector(state => state.user.value)
    const [videoURL, setVideoURL] = useState("");
    const [episode, setEpisode] = useState(1);
    const [hasDubbed, setHasDubbed] = useState(false);
    const [isDubbed, setIsDubbed] = useState(user.userPreferenceDubbed);

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
    return (
        <div>
            <div className='text-xl'>Streaming</div>
            {/* {JSON.stringify(videoURL)} */}
            {windowLoaded && <VideoPlayer
                url={videoURL}
                hasNextEpisode={(episode === (anime.nextAiringEpisode ? anime.nextAiringEpisode.episode - 1 : anime.episodes)) ? false : true}
                onNextEpisode={() => { setEpisode(state => state + 1) }} />}
            <div className="flex flex-col sm:flex-row w-full justify-center items-center">
                {/* Episode Selector */}
                <div className="flex flex-row justify-center ml-0 sm:ml-auto">
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
                <FormGroup sx={{ ml: "auto" }}>
                    <FormControlLabel disabled={!hasDubbed} control={<Switch checked={isDubbed} onChange={() => { setIsDubbed(state => !state) }} />} label={isDubbed ? "Dubbed" : "Subbed"} />
                </FormGroup>
            </div>
        </div>
    )
}

export default Streaming