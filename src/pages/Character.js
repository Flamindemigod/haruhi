import { useEffect, useState, createRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
import makeQuery from '../misc/makeQuery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Skeleton } from '@mui/material';
const Character = () => {
  const params = useParams();
  const dispatch = useDispatch()
  const [onList, setOnList] = useState(null)
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [showDescription, setShowDescription] = useState(true);
  let description = createRef();

  const [character, setCharacter] = useState({
    id: 0, name: { userPreferred: "", alternative: [] }, description: "", image: { large: "" }, age: 0, bloodType: "", gender: "", dateOfBirth: {
      year: null,
      month: null,
      day: null
    }, media: { pageInfo: { hasNextPage: false }, nodes: [] }
  });

  useEffect(() => {
    const getCharacter = async () => {
      const query = `query getCharacterData($id: Int = 1, $page: Int = 1, $onList: Boolean) {
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
              media(page: $page, onList: $onList, type: ANIME) {
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
        onList
      };

      let hasNextPage = true
      let _character = {};
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
        const characterData = await makeQuery(query, variables);

        _character = characterData.data.Character
        document.title = `Haruhi - ${_character.name.userPreferred}`

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
        setCharacter({ ..._character, media: { nodes: accumalatedMedia } })
      dispatch(setLoading(false));


      }

    };
    getCharacter();
    //eslint-disable-next-line
  }, [onList])

  useEffect(()=>{
    if (description.current.offsetHeight >= 170) {
        setShowDescription(false)
      }
}, [character])

  return (
    <div className='p-8'>
      <div className="flex justify-center sm:px-16  sm:flex-row  flex-col">
        {character.image.large ? <LazyLoadImage
          className='h-64 w-48 object-cover self-center sm:self-start mb-8'
          src={character.image.large}
          alt={`Character ${character.name.userPreferred}`} />: <Skeleton variant="rectangular" width={192} height={256} />}
        <div className="flex flex-col p-4 justify-center">
          <div className='px-8 text-3xl'>{character.name.userPreferred}</div>
          <div className='px-8 pb-8 text-lg'>{character.name.alternative.map((name) => (`| ${name} |`))}</div>
          {character.bloodType ? <div className='text-md px-8'><strong>Blood Type:</strong> {character.bloodType}</div> : <></>}
      {character.gender ? <div className='text-md px-8'><strong>Gender:</strong> {character.gender}</div> : <></>}
      {character.dateOfBirth.year || character.dateOfBirth.month || character.dateOfBirth.day ? <div className='text-md px-8'><strong>Date of Birth:</strong> {character.dateOfBirth.day}  {months[character.dateOfBirth.month-1]}   {character.dateOfBirth.year}</div> : <></>}
      {character.age ? <div className='text-md px-8 '><strong>Age:</strong> {character.age}</div> : <></>}
      <div className='text-md px-8 description' ref={description} data-description-shown={showDescription}  dangerouslySetInnerHTML={{ __html: character.description }}></div>
      {!showDescription ? <button className='hover:underline text-primary-400 hover:text-primary-600 mx-auto ' onClick={()=>{setShowDescription(true)}}> Show More</button> : <></>}

        </div>

      </div>
      
      <FormGroup className='p-8 ml-auto w-max'>
        <FormControlLabel control={<Switch checked={onList} onClick={() => { setOnList((state) => (state ? null : true)) }} />} label="On My List" />
      </FormGroup>
      <div className='flex flex-wrap gap-4 justify-center'>

        {character.media.nodes.map((media) => (<Link className='cardLink' to={`/anime/${media.id}`}><AnimeCard mediaTitle={media.title.userPreferred} mediaCover={media.coverImage.large} episodes={media.episodes} progress={media.mediaListEntry ? media.mediaListEntry.progress : null} nextAiringEpisode={media.nextAiring ? media.nextAiring.node.episode : 0} timeUntilAiring={media.nextAiring ? media.nextAiring.node.timeUntilAiring : 0} /></Link>))}
      </div>
    </div>
  )
}

export default Character