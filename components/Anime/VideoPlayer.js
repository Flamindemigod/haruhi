import { useEffect, useState, useRef, useMemo } from 'react';
import ReactPlayer from 'react-player/lazy'
import { Box, Button, styled, LinearProgress, Slider, linearProgressClasses, IconButton } from '@mui/material'
import screenfull from 'screenfull';
import { PlayArrow, Pause, SkipNext, VolumeUp, VolumeMute, VolumeDown, PictureInPictureAlt, Fullscreen } from '@mui/icons-material';
import _ from "lodash";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 2,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },

}));

function format(seconds) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`
    }
    return `${mm}:${ss}`
}

function pad(string) {
    return ('0' + string).slice(-2)
}

const VideoPlayer = ({ url, setProgress, onNextEpisode, hasNextEpisode, onReady }) => {
    let timeoutID = null
    const [isMuted, setIsMuted] = useState(0);
    const [controlsHidden, setControlsHidden] = useState(0);

    const [playerState, setPlayerState] = useState({
        url: null,
        pip: false,
        playing: false,
        controls: false,
        light: false,
        volume: 0.8,
        muted: false,
        duration: 0,
        played: 0,
        playedSeconds: 0,
        loaded: 0,
        loadedSeconds: 0,
        playbackRate: 1.0,
        loop: false,
    });
    const videoPlayer = useRef();
    const playerContainer = useRef();


    function keyboardShortcuts(event) {
        const { key } = event;
        switch (key) {
            case 'k':
                setPlayerState((state) => ({ ...state, playing: !state.playing }))
                break;
            case ' ':
                setPlayerState((state) => ({ ...state, playing: !state.playing }))
                break;
            case 'm':
                toggleMute()
                break;
            case 'f':
                handleClickFullscreen();
                break;
            case 'p':
                setPlayerState((state) => ({ ...state, playing: !state.playing }))
                break;
            default:
                break
        }
    }

    const toggleMute = () => {
        if (isMuted !== 0) {
            setPlayerState((state) => ({ ...state, volume: isMuted }));
            setIsMuted(0);
        }
        else {
            setIsMuted(playerState.volume);
            setPlayerState((state) => ({ ...state, volume: 0 }));
        }
    }

    const handleClickFullscreen = () => {
        if (screenfull.isFullscreen) {
            screenfull.exit(playerContainer.current)
            window.screen.orientation.unlock()
        }
        else {
            screenfull.request(playerContainer.current)
            window.screen.orientation.lock("landscape")
        }
    }

    useEffect(() => {
        setPlayerState(state => ({ ...state, url: url }));
    }, [url]);

    useEffect(() => {
        setControlsHidden(playerState.playing);
    }, [playerState.playing]);

    useEffect(() => {
        document.addEventListener('keyup', keyboardShortcuts, true);
        return (document.removeEventListener('keyup', keyboardShortcuts))
    }, []);

    const throttledPlayerControlHandler = useMemo(() => _.throttle((e) => {
        clearTimeout(timeoutID)
        setControlsHidden(false)
        timeoutID = setTimeout(() => { setControlsHidden(true) }, 3000)
    }, 300), [])

    return (
        <Box className="player | relative isolate" sx={{ aspectRatio: "16/9" }} ref={playerContainer} onMouseMove={throttledPlayerControlHandler} onTouchStart={throttledPlayerControlHandler}>
            <ReactPlayer width="100%" height="100%"
                url={playerState.url}
                ref={videoPlayer}
                playing={playerState.playing}
                volume={playerState.volume}
                pip={playerState.pip}
                onReady={onReady}
                onProgress={(newState) => {
                    setProgress(newState.played)
                    setPlayerState(state => ({ ...state, ...newState }))
                }}
                onDuration={(duration) => {
                    setPlayerState(state => ({ ...state, duration }))
                }} />

            <Box className="player--controls | absolute inset-0 z-10" hidden={controlsHidden}>
                {/* Seek Fields */}

                <div className='flex w-full h-full'>
                    <div className='w-full h-full' onDoubleClick={() => { videoPlayer.current.seekTo(videoPlayer.current.getCurrentTime() - 10) }}></div>
                    <div className='w-full h-full' onDoubleClick={() => { videoPlayer.current.seekTo(videoPlayer.current.getCurrentTime() + 10) }}></div>
                </div>
                {/* Play / Pause Button */}
                <Button className='top-1/2 left-1/2'
                    sx={{ position: "absolute", color: "#eee", transform: "translate(-50%, -50%)" }}
                    onClick={() => { setPlayerState(state => ({ ...state, playing: !state.playing })) }}>
                    {playerState.playing ? <Pause sx={{ width: 64, height: 64 }} /> : <PlayArrow sx={{ width: 64, height: 64 }} />}
                </Button>
                {/* Bottom Controls */}
                <Box className='absolute -bottom-1 left-0 right-0 flex flex-col bg-gradient-to-t from-black to-transparent'>
                    <div className='relative'>
                        <BorderLinearProgress variant="determinate" color='inherit' value={playerState.loaded * 100} />
                        <Slider
                            sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", padding: 0, marginBlock: "auto", "& .MuiSlider-thumb": { width: 16, height: 16 }, "& .MuiSlider-rail": { display: "none" } }}
                            aria-label="Progress Slider"
                            value={playerState.played * 100}
                            onChange={(event, newValue) => {
                                setPlayerState(state => ({ ...state, played: newValue / 100 }))
                                videoPlayer.current.seekTo(newValue / 100, "fraction");
                            }} />
                    </div>
                    <div className='flex'>
                        <Button className=''
                            sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }}
                            onClick={() => { setPlayerState(state => ({ ...state, playing: !state.playing })) }}>
                            {playerState.playing ? <Pause /> : <PlayArrow />}
                        </Button>
                        <Button
                            sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }}
                            aria-label="Next Episode"
                            disabled={!hasNextEpisode}
                            onClick={onNextEpisode}

                        >
                            <SkipNext />
                        </Button>
                        {/* Elapsed Time */}
                        <Box className="my-auto px-4 min-w-max">{format(playerState.playedSeconds)} / {format(playerState.duration)}</Box>
                        {/* Volume Mute  Button*/}
                        {/* Volume Slider */}
                        <Box className="p-0 flex gap-2 items-center flex-grow" sx={{ minWidth: "5rem", maxWidth: "9rem" }}>
                            <Button sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }} aria-label='Volume Mute' onClick={toggleMute}>{playerState.volume >= 0.5 ? <VolumeUp /> : (playerState.volume === 0 ? <VolumeMute /> : <VolumeDown />)}</Button>
                            <Slider sx={{ width: "100%" }} valueLabelDisplay="auto" size={"small"} aria-label="Volume Slider" value={parseInt(playerState.volume * 100)} onChange={(event, newValue) => { setPlayerState((state) => ({ ...state, volume: parseInt(newValue) / 100 })) }} />
                        </Box>
                        {/* PiP */}
                        <div className="flex ml-auto">
                            {document.pictureInPictureEnabled && <Button sx={{ color: "white" }} onClick={() => { setPlayerState((state) => ({ ...state, pip: !state.pip })) }}>
                                <PictureInPictureAlt />
                            </Button>}
                            {/* Fullscreen */}
                            <Button sx={{ color: "white" }} onClick={handleClickFullscreen}>
                                <Fullscreen />
                            </Button>
                        </div>
                    </div>
                </Box>
            </Box>
        </Box >
    )
}

export default VideoPlayer