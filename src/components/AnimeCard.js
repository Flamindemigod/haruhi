import React from 'react'
import Countdown, { zeroPad } from "react-countdown";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { animated, useSpring } from '@react-spring/web'

const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <></>;
    } else {
      // Render a countdown
      return (
        <span>
          {days ? `${zeroPad(days)}d : ` : ""}
          {(days || hours) ? `${zeroPad(hours)}h : ` : ""}{" "}
          {(days || hours  || minutes) ? `${zeroPad(minutes)}m` : ""}
        </span>
      );
    }
  };

const AnimeCard = ({mediaCover, mediaTitle, nextAiringEpisode, timeUntilAiring, episodes, progress, mediaListStatus}) => {
  const styles = useSpring({
    from: {
      opacity: 0,
      translateY: "50%",
      scale: 0
    },
    to: {
      scale:1,
      opacity: 1,
      translateY: "0%"
    },
  })  
  return (
        <animated.div className='card relative overflow-hidden' style={styles}>
            <LazyLoadImage draggable={false} className='h-full w-full object-cover' src={mediaCover} alt={`Cover for ${mediaTitle}`} />
            <div className=' absolute top-full text-sm text-white w-full bg-black text-center'>
                <div>{mediaTitle}</div>
                {nextAiringEpisode ? (<p className="animeCountdown">
            {`Ep ${nextAiringEpisode}`} {episodes ? `/ ${episodes}`:""} airing in {" "}<br/>
            <Countdown
              date={Date.now() + timeUntilAiring * 1000}
              renderer={renderer}
            />
          </p>) : (<></>)}
            </div>
          {(progress < (nextAiringEpisode-1))? <div className='notification'></div> : <></>}
          {(mediaListStatus === "CURRENT")? <div className='mediaListNotification current'></div> : <></>}
          {(mediaListStatus === "PAUSED")? <div className='mediaListNotification paused'></div> : <></>}
          {(mediaListStatus === "COMPLETED")? <div className='mediaListNotification completed'></div> : <></>}
          {(mediaListStatus === "DROPPED")? <div className='mediaListNotification dropped'></div> : <></>}
          {(mediaListStatus === "PLANNING")? <div className='mediaListNotification planning'></div> : <></>}





        </animated.div>
    )
}

AnimeCard.defaultProps = {
    mediaCover:"", mediaTitle:"", nextAiringEpisode:0, timeUntilAiring:0, episodes:0, progress:0, mediaListStatus:""
}

export default AnimeCard