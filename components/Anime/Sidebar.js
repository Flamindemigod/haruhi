import { Box } from "@mui/material";
import Link from "next/link";
import Countdown, { zeroPad } from "react-countdown";


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


const Content = ({ title, content, containerClass = "" }) => {
    return (
        <div className={containerClass}>
            <div className='font-semibold w-max'>{title}</div>
            <div className="w-max">{content}</div>
        </div>
    )
}


const Sidebar = ({ anime }) => {

    return (
        <Box className='flex flex-row md:flex-col gap-4 overflow-x-scroll md:overflow-auto bg-offWhite-900 rounded-md p-4' sx={{ maxWidth: "95vw" }}>
            {anime.nextAiringEpisode && <Content title="Next Airing" content={<>
                {`Episode ${anime.nextAiringEpisode.episode} in `}
                <Countdown date={Date.now() + anime.nextAiringEpisode.timeUntilAiring * 1000} renderer={countdownRenderer} />
            </>} containerClass="text-primary-500" />}
            <Content title="Format" content={anime.format} />
            <Content title="Source" content={<div className="capitalize">{anime.source.replace(/[_]/gm, " ").toLowerCase()}</div>} />
            <Content title="Episodes" content={anime.episodes} />
            <Content title="Episode Duration" content={`${anime.duration} mins`} />
            <Content title="Status" content={<div className="capitalize">{anime.status.toLowerCase().replace(/[_]/gm, " ")}</div>} />
            <Content title="Start Date" content={`${anime.startDate.day}/${anime.startDate.month}/${anime.startDate.year}`} />
            <Content title="End Date" content={`${anime.endDate.day}/${anime.endDate.month}/${anime.endDate.year}`} />
            {anime.season && <Content title="Season" content={<div className="capitalize">{anime.season.replace(/[_]/gm, " ").toLowerCase()}</div>} />}
            {anime.averageScore && <Content title="Average Score" content={`${anime.averageScore}%`} />}
            <Content title="Studios" content={<div className="flex flex-col">{anime.studios.edges.filter(edge => { if (edge.isMain) { return true } return false }).map(edge => (
                <Link key={edge.node.id} href={`/studio/${edge.node.id}`}>
                    <div className="cursor-pointer">{edge.node.name}</div>
                </Link>
            ))}</div>} />
            <Content title="Producers" content={<div className="flex flex-col">{anime.studios.edges.filter(edge => { if (edge.isMain) { return false } return true }).map(edge => (
                <Link key={edge.node.id} href={`/studio/${edge.node.id}`}>
                    <div className="cursor-pointer">{edge.node.name}</div>
                </Link>
            ))}</div>} />
            <Content title="Genres" content={<div className="flex flex-col">{
                anime.genres.map(genre => (<div key={genre}>{genre}</div>))
            }</div>} />
            <Content title="Tags" content={<div className="flex flex-col">{
                anime.tags.map(tag => (<div className="flex justify-between gap-4" key={tag.id}><div>{tag.name}</div><div>{`${tag.rank}%`}</div></div>))
            }</div>} />
        </Box>
    )
}

export default Sidebar