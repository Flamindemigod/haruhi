import Card from "../Card";
import Carosel from "../Carosel";

const TrendingSeason = ({ data = [] }) => {
  return (
    <div className="">
      <div className="text-xl p-4">Trending This Season</div>
      <Carosel width={"95vw"}>
        {data.map((anime, index) => (
          <Card
            key={anime.id}
            height={167}
            width={128}
            status={anime.status}
            image={anime.coverImage.large}
            title={anime.title.userPreferred}
            link={`/anime/${anime.id}`}
            hasNotif={true}
            listStatus={anime.mediaListEntry && anime.mediaListEntry.status}
            progress={anime.mediaListEntry && anime.mediaListEntry.progress}
            episodes={anime.episodes}
            changeDirection={data.length - index < 5 ? true : false}
            nextAiringEpisode={
              anime.nextAiring && anime.nextAiring.node.episode
            }
            nextAiringTime={
              anime.nextAiring && anime.nextAiring.node.timeUntilAiring
            }
          />
        ))}
      </Carosel>
    </div>
  );
};

export default TrendingSeason;
