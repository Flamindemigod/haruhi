import { useEffect, useState } from 'react'
import makeQuery from '../misc/makeQuery'
import AnimeCard from './AnimeCard';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';




const SeasonalLists = ({ season, seasonYear }) => {

  const [seasonalAnime, setSeasonalAnime] = useState([])
  useEffect(() => {
    const getSeasonal = async () => {
      const query = `query getSeasonal($season: MediaSeason, $seasonYear: Int, $page:Int=1) {
        Page(page:$page, perPage:50) {
          pageInfo {
            hasNextPage
          }
          media(season: $season, seasonYear: $seasonYear, type:ANIME, sort: [POPULARITY_DESC]) {
            id
            title {
              userPreferred
            }
            coverImage{
              large
            }
            episodes
            startDate{
              year
            }
            airingSchedule{
              edges{
                node{
                  episode
                  timeUntilAiring
                }
              }
              
            }
            mediaListEntry{
              progress
            }
          }
        }
      }
        
`;
      let variables = {
        season,
        seasonYear,
        page: 1
      };
      let hasNextPage = true
      let accumalatedMedia = [];
      const getAiring = (media) => {
        const airingSchedule = media.airingSchedule;
        delete media.airingSchedule;
        const nextAiringIndex = airingSchedule.edges.findIndex(
          (element) => element.node.timeUntilAiring > 0
        );
        media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
        return media
      }
      while (hasNextPage) {
        const data = await makeQuery(query, variables);
        if (data.data.Page.pageInfo.hasNextPage) {
          variables["page"] += 1
        }
        else {
          hasNextPage = false
        }
        accumalatedMedia = accumalatedMedia.concat(data.data.Page.media)
      }
      for (const media in accumalatedMedia) {
        accumalatedMedia[media] = getAiring(accumalatedMedia[media])
      }
      setSeasonalAnime(accumalatedMedia)
    }
    getSeasonal()

  }, [season, seasonYear])
  return (
    <Box className='my-4  grid gap-4 justify-center' sx={{gridTemplateColumns: "repeat(auto-fit, 10rem)"}}>{seasonalAnime.map((media) => (
      <Link className="cardLink" key={media.id} to={`/anime/${media.id}`} >
        <AnimeCard
          mediaTitle={media.title.userPreferred}
          mediaCover={media.coverImage.large}
          episodes={media.episodes}
          progress={media.mediaListEntry ? media.mediaListEntry.progress : null}
          nextAiringEpisode={media.nextAiring ? media.nextAiring.node.episode : 0}
          timeUntilAiring={media.nextAiring ? media.nextAiring.node.timeUntilAiring : 0}
        />
      </Link>))}</Box>
  )
}

export default SeasonalLists