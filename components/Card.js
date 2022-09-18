import { Box, useMediaQuery } from '@mui/material'
import Image from 'next/image';
import Link from 'next/link';
import Countdown, { zeroPad } from "react-countdown";
import { animated, useSpring } from '@react-spring/web';
import { useDispatch } from 'react-redux';
import { setLoading } from "../features/loading";


const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <></>;
    } else {
        // Render a countdown
        return (
            <span>
                {days ? `${zeroPad(days)}d : ` : ""}
                {(days || hours) ? `${zeroPad(hours)}h : ` : ""}{" "}
                {(days || hours || minutes) ? `${zeroPad(minutes)}m` : ""}
            </span>
        );
    }
};

const Card = ({ height, width, image, status, title, link, progress, episodes, nextAiringEpisode, nextAiringTime, listStatus, changeDirection }) => {
    const dispatch = useDispatch();
    const hasHover = useMediaQuery("(hover: hover)");
    const styles = useSpring({
        from: {
            opacity: 0,
            translateY: "50%",
            scale: 0
        },
        to: {
            scale: 1,
            opacity: 1,
            translateY: "0%"
        },
    })
    return (
        <animated.div style={styles} onClick={() => { dispatch(setLoading(true)) }}>
            <Link href={link} >
                <Box className='card | relative cursor-pointer flex' sx={{ height }}>
                    <Box className="card--image" sx={{ aspectRatio: "4/3", height, width }}>
                        <Image draggable={false} width={width} height={height} className='object-cover' src={image} />
                    </Box>
                    <div className={`card--content | flex-col ${hasHover && "absolute"} ${changeDirection ? "right-full" : "left-full"} w-64 top-0 bottom-0 bg-offWhite-600 z-10 p-4`}>
                        <div className="card--title | text-lg">{title}</div>

                        <div className='mt-auto'>{progress ? `Progress: ${progress} ${episodes ? "/" : "+"} ${episodes ? episodes : ""}` : ""}</div>
                        <div>{nextAiringTime && (<div>
                            {`Ep ${nextAiringEpisode} airing in `}
                            <Countdown
                                date={Date.now() + nextAiringTime * 1000}
                                renderer={countdownRenderer}
                            />
                        </div>)}</div>
                        {status && <div className='capitalize'>{status.replace(/[_]/gm, " ").toLowerCase()}</div>}


                    </div>
                    {((progress < (nextAiringEpisode - 1)) && progress) && <div className='notification'></div>}
                    {(listStatus === "CURRENT") && <div className='mediaListNotification current'></div>}
                    {(listStatus === "PAUSED") && <div className='mediaListNotification paused'></div>}
                    {(listStatus === "COMPLETED") && <div className='mediaListNotification completed'></div>}
                    {(listStatus === "DROPPED") && <div className='mediaListNotification dropped'></div>}
                    {(listStatus === "PLANNING") && <div className='mediaListNotification planning'></div>}
                </Box>
            </Link>
        </animated.div>
    )
}

export default Card