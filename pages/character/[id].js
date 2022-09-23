import makeQuery from '../../makeQuery';
import * as cookie from 'cookie'
import { useEffect, useRef, useState } from 'react';
import Description from '../../components/Anime/Description';
import Image from 'next/future/image';
import { Skeleton, Box, useMediaQuery, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../features/loading';
import Card from '../../components/Card';
import { AnimatePresence } from 'framer-motion';
import Meta from "../../components/Meta";

const Character = ({ character }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value)
  const grid = useRef();

  const hasHover = useMediaQuery("(hover:hover)");
  const [gridColumnCount, setGridColumnCount] = useState(1);
  const [media, setMedia] = useState([]);
  const [onList, setOnList] = useState(false);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const handleResize = () => {
      const gridComputedStyle = window.getComputedStyle(grid.current);
      // get number of grid columns
      const _gridColumnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
      setGridColumnCount(_gridColumnCount)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return (() => { window.removeEventListener("resize", handleResize) })
  }, [])

  useEffect(() => {
    dispatch(setLoading(false))
  }, [character])

  useEffect(() => {
    setMedia([])
    if (onList && user.userAuth) {
      setMedia(character.media.nodes.filter((media) => {
        if (media.mediaListEntry) {
          return true
        }
        return false
      }))
    } else {
      setMedia(character.media.nodes)
    }
  }, [onList])
  return (
    <>
      <Meta
        title={character.name.userPreferred}
        description={character.description}
        image={character.image.large}
        url={`/character/${character.id}`} />
      <div className='p-4'>
        <div className="flex justify-center sm:px-16  sm:flex-row flex-col">
          {character.image.large ? <Image
            width={192}
            height={256}
            className='object-cover self-center sm:self-start mb-8'
            src={character.image.large}
            alt={`Character ${character.name.userPreferred}`} /> : <Skeleton variant="rectangular" width={192} height={256} />}
          <div className="flex flex-col p-4 justify-center">
            <div className='px-8 text-3xl'>{character.name.userPreferred}</div>
            <div className='px-8 pb-8 text-lg'>{character.name.alternative.map((name) => (`| ${name} |`))}</div>
            {character.bloodType ? <div className='text-md px-8'><strong>Blood Type:</strong> {character.bloodType}</div> : <></>}
            {character.gender ? <div className='text-md px-8'><strong>Gender:</strong> {character.gender}</div> : <></>}
            {character.dateOfBirth.year || character.dateOfBirth.month || character.dateOfBirth.day ? <div className='text-md px-8'><strong>Date of Birth:</strong> {character.dateOfBirth.day}  {months[character.dateOfBirth.month - 1]}   {character.dateOfBirth.year}</div> : <></>}
            {character.age ? <div className='text-md px-8 '><strong>Age:</strong> {character.age}</div> : <></>}
            {character.description ? <Description text={character.description} /> : <></>}
          </div>
        </div>
        <FormGroup className='p-8 ml-auto w-max'>
          <FormControlLabel control={<Switch checked={onList} onClick={() => { setOnList((state) => (state ? null : true)) }} />} label="On My List" />
        </FormGroup>
        <div className="w-full flex justify-center">
          <Box ref={grid} className={`grid justify-center gap-4 w-max ${hasHover ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
            <AnimatePresence>
              {media.map((el, index) => (
                <Card
                  key={el.id}
                  width={128}
                  height={168}
                  image={el.coverImage.large}
                  title={el.title.userPreferred}
                  link={`/anime/${el.id}`}
                  status={el.status}
                  changeDirection={(index % gridColumnCount >= gridColumnCount - 2 && index > 2) ? true : false}
                  episodes={el.episodes}
                  nextAiringEpisode={el.nextAiring && el.nextAiring.node.episode}
                  nextAiringTime={el.nextAiring && el.nextAiring.node.timeUntilAiring}
                  progress={el.mediaListEntry && el.mediaListEntry.progress}
                  listStatus={el.mediaListEntry && el.mediaListEntry.status}
                />

              ))}
            </AnimatePresence>
          </Box>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params, req }) {
  const query = `query getCharacterData($id: Int = 1, $page: Int = 1) {
        Character(id: $id) {
          id
          name {
            userPreferred
            alternative
          }
          description(asHtml:true)
          image {
            large
          }
          age
          bloodType
          gender
          dateOfBirth {
            year
            month
            day
          }
          media(page: $page, type: ANIME) {
            pageInfo {
              hasNextPage
            }
            nodes {
                id
              title {
                userPreferred
              }
              coverImage{
                large
              }
              episodes
              mediaListEntry{
                progress
                status
              }
              airingSchedule {
                edges {
                  node {
                    airingAt
                    timeUntilAiring
                    episode
                  }
                }
              }
              status
              startDate {
                year
                month
                day
              }
            }
          }
        }
      }          
    `;
  const variables = {
    id: params.id,
    page: 1,
  };
  let hasNextPage = true
  let data = {};
  let _character = {};
  let accumalatedMedia = [];

  const getAiring = (media) => {
    const airingSchedule = media.airingSchedule;
    delete media.airingSchedule;
    const nextAiringIndex = airingSchedule.edges.findIndex(
      (element) => element.node.timeUntilAiring > 0
    );
    media["nextAiring"] = airingSchedule.edges[nextAiringIndex] || null;
    return media
  }

  while (hasNextPage) {
    const characterData = await makeQuery(query, variables, req.headers.cookie ? cookie.parse(req.headers.cookie).access_token : null);
    _character = characterData.data.Character
    if (characterData.data.Character.media.nodes.length) {
      variables["page"] = variables["page"] + 1
      for (const media in characterData.data.Character.media.nodes) {
        characterData.data.Character.media.nodes[media] = getAiring(characterData.data.Character.media.nodes[media])
      }
      accumalatedMedia = [...accumalatedMedia, ...characterData.data.Character.media.nodes]
    }
    else {
      hasNextPage = false
    }
    data = { ..._character, media: { nodes: accumalatedMedia } }
  }
  return {
    props: { character: data }
  }
}

export default Character