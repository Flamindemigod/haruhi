import React, { useEffect, useState } from 'react'
import makeQuery from '../misc/makeQuery';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
const SearchStaff = ({ searchString, setDialogOpen, setSearchQuery }) => {
    const [searchResults, setSearchResults] = useState({ "staff": [] })

    useEffect(() => {
        const search = async () => {
            const query = `query Search($searchString: String) {
              Page(perPage:6) {
                staff(search: $searchString, sort: [SEARCH_MATCH]) {
                  image {
                    medium
                  }
                  name {
                    userPreferred
                  }
                  id
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
    {searchResults.staff.length ? <div className='bg-offWhite-500'>
        <div className='text-lg px-4'>Staff</div>
        <ul className="flex flex-col gap-4 justify-center p-4">
            {searchResults.staff.map((_staff) => (<Link to={`/staff/${_staff.id}`} key={_staff.id} onClick={() => { setDialogOpen(false); setSearchQuery("") }}><li className=' w-auto h-16'><ButtonBase sx={{ justifyContent: "flex-start" }} className='flex text-sm sm:text-md gap-4 w-full bg-offWhite-600'><img className="h-16" src={_staff.image.medium} alt="" /> <div className=''>{_staff.name.userPreferred}</div></ButtonBase></li></Link>))}
        </ul>
    </div> : <></>}
    </>
    )
}

export default SearchStaff