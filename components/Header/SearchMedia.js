import { useEffect, useState } from 'react'
import makeQuery from '../../makeQuery';
import Link from 'next/link';
import { ButtonBase } from '@mui/material';
import Image from 'next/image';
const SearchMedia = ({ searchString, setDialogOpen, setSearchQuery }) => {
    const [searchResults, setSearchResults] = useState({ "media": [] })

    useEffect(() => {
        const search = async () => {
            const query = `query Search($searchString: String){
            Page(perPage: 6){
              media(search:$searchString, type:ANIME, sort:[POPULARITY_DESC]) {
                id
                title{
                  userPreferred
                }
                coverImage{medium}
                
              }
            }
          }
          `;
            const variables = {
                searchString
            };
            const data = await makeQuery(query, variables);
            setSearchResults(data.data.Page)
        }
        search()

    }, [searchString])
    return (
        <>
            {searchResults.media.length ? <div className='bg-offWhite-500'>
                <div className='text-lg px-4'>Anime</div>
                <div className="flex flex-col gap-4 p-4 justify-center">
                    {searchResults.media.map((media) => (<Link href={`/anime/${media.id}`} key={media.id} onClick={() => { setDialogOpen(false); setSearchQuery("") }}><div className=' w-auto h-16'><ButtonBase sx={{ justifyContent: "flex-start" }} className='flex text-sm sm:text-md gap-4 w-full'><Image height={64} width={48} src={media.coverImage.medium} alt="" /> <div className=''>{media.title.userPreferred}</div></ButtonBase></div></Link>))}
                </div>
            </div> : <></>}
        </>
    )
}

export default SearchMedia