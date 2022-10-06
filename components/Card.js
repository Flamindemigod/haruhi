import { Box, useMediaQuery } from '@mui/material'
import Image from "next/future/image";
import Link from './Link';
import Countdown, { zeroPad } from "react-countdown";
import { motion } from 'framer-motion';

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
    const hasHover = useMediaQuery("(hover: hover)");
    return (
        <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}

        >
            <Link href={link} >

                <Box className='card | relative cursor-pointer flex' sx={{ height }}>
                    <Image draggable={false} width={width} height={height} className='card--image | object-cover' src={image} alt={title} />
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
                    {(listStatus === "CURRENT" && (progress < (nextAiringEpisode - 1))) ? <div className='notification'></div> : <></>}
                    {(listStatus === "CURRENT") && <div className='mediaListNotification current'></div>}
                    {(listStatus === "PAUSED") && <div className='mediaListNotification paused'></div>}
                    {(listStatus === "COMPLETED") && <div className='mediaListNotification completed'></div>}
                    {(listStatus === "DROPPED") && <div className='mediaListNotification dropped'></div>}
                    {(listStatus === "PLANNING") && <div className='mediaListNotification planning'></div>}
                </Box>
            </Link>

        </motion.div>
    )
}

export default Card