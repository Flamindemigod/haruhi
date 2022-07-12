import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { setLoading } from '../features/loading';
import { useDispatch } from 'react-redux';
import makeQuery from '../misc/makeQuery';
import AnimeCard from '../components/AnimeCard';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Studio = () => {
    const params = useParams();

    const dispatch = useDispatch();
    const [onList,setOnList] = useState(false)
    const [studio, setStudio] = useState({id: 0, name:"", media:{nodes:[]}});
    
    useEffect(() => {
        const getStudio = async () => {
            const query = `query getStudio($id: Int = 839, $onList: Boolean = false, $page:Int=1) {
                Studio(id: $id) {
                  id
                  name
                  media(onList: $onList sort:[START_DATE_DESC] perPage:25 page:$page) {
                    nodes {
                        id
                      title {
                        userPreferred
                      }
                      coverImage{
                        large
                      }
                      episodes
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
            let variables = {
                id: params.id,
                onList: onList,
                page: 1,
            };
            let hasNextPage = true
            let _studio = {};
            let accumalatedMedia = [];
            while (hasNextPage) {
                const studioData = await makeQuery(query, variables);
                _studio = studioData.data.Studio
            document.title = `Haruhi - ${_studio.name}`

                if (studioData.data.Studio.media.nodes.length){
                    {variables["page"] = variables["page"] + 1}
                    accumalatedMedia = [...accumalatedMedia, ...studioData.data.Studio.media.nodes]
                    setStudio({id: _studio.id, name:_studio.name, media:{nodes:accumalatedMedia}})
                }
                else {
                    hasNextPage=false
                }
            }

            dispatch(setLoading(false));


            
        };
        getStudio();
    }, [params, onList])


    return (
        <div className='w-11/12 mx-auto'>
        <div className="flex justify-between p-8">
            <h1 className='text-3xl '>{studio.name}</h1>
            <FormGroup>
                  <FormControlLabel control={<Switch checked={onList} onClick={()=>{setOnList((state)=>(!state))}} />} label="On My List" />
                </FormGroup>
        </div>
        <div className='flex flex-wrap gap-4'>
            {studio.media.nodes.map((media)=>(<Link className='cardLink' to={`/anime/${media.id}`}><AnimeCard mediaTitle={media.title.userPreferred} mediaCover={media.coverImage.large}/></Link>))}
        </div>
        </div>
    )
}

export default Studio