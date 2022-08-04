import React, { useEffect, useState } from 'react'
import makeQuery from '../misc/makeQuery';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
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
        <ul className="flex flex-col gap-4 justify-center p-4">
            {searchResults.characters.map((character) => (<Link to={`/character/${character.id}`} key={character.id} onClick={() => { setDialogOpen(false); setSearchQuery("") }}><li className=' w-auto h-16'><ButtonBase sx={{ justifyContent: "flex-start" }} className='flex text-sm sm:text-md gap-4 w-full bg-offWhite-600'><img className="h-16" src={character.image.medium} alt="" /> <div className=''>{character.name.full}</div></ButtonBase></li></Link>))}
        </ul>
    </div> : <></>}
    </>
    )
}

export default SearchCharacter