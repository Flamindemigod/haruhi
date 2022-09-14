import { useEffect, useState } from 'react'
import makeQuery from '../../makeQuery';
import Link from 'next/link';
import { ButtonBase } from '@mui/material';
import Image from 'next/image';
const SearchCharacter = ({ searchString, setDialogOpen, setSearchQuery }) => {
    const [searchResults, setSearchResults] = useState({ "characters": [] })

    useEffect(() => {
        const search = async () => {
            const query = `query Search($searchString: String) {
              Page(perPage:6) {
                characters(search: $searchString, sort:[SEARCH_MATCH]) {
                  id
                  name{
                    full
                  }
                  image {
                    medium
                  }
                }
              }
            }`;
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
            {searchResults.characters.length ? <div className='bg-offWhite-500'>
                <div className='text-lg px-4'>Characters</div>
                <div className="flex flex-col gap-4 justify-center p-4">
                    {searchResults.characters.map((character) => (<Link href={`/character/${character.id}`} key={character.id} onClick={() => { setDialogOpen(false); setSearchQuery("") }}><div className='w-auto h-16'><ButtonBase sx={{ justifyContent: "flex-start" }} className='flex text-sm sm:text-md gap-4 w-full'><Image height={64} width={48} src={character.image.medium} alt="" /> <div className=''>{character.name.full}</div></ButtonBase></div></Link>))}
                </div>
            </div> : <></>}
        </>
    )
}

export default SearchCharacter