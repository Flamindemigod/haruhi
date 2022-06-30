import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Search } from '@mui/icons-material';
import { Button, ButtonBase, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import makeQuery from '../misc/makeQuery';
import { Link } from 'react-router-dom';

const SearchInput = styled(InputBase)(({ theme }) => ({
    '&': { width: "100%", height: "100%" },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        color: "white",
        backgroundColor: "#414141",
        transition: theme.transitions.create([
            'box-shadow',
        ]),
        // Use the system font instead of the default Roboto font.
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

const SearchAnime = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState({"data":{"Page":{"media":[]}}})
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(()=>{
        const search = async () =>{const query = `query Search($searchstring: String){
            Page{
              media(search:$searchstring, type:ANIME, sort:[POPULARITY_DESC]) {
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
            searchstring: searchQuery,
          };
          const data = await makeQuery(query, variables);
          setSearchResults(data)
        }
        search()
        
    }, [searchQuery])
    return (
        <>
            <Button sx={{ color: "#fff", fontSize: "1.25rem", textTransform: "none", fontWeight: "normal", borderColor: "transparent", ":hover": { borderColor: "#fff" } }} variant='outlined' endIcon={<Search />} onClick={() => { setDialogOpen(true) }}> Search </Button>
            <Dialog
                maxWidth={"xl"}
                fullWidth={true}
                open={dialogOpen}
                onClose={() => { 
                    setSearchQuery("");
                    setSearchResults({"data":{"Page":{"media":[]}}})
                    setDialogOpen(false);
                 }}
                aria-labelledby="search-dialog"
                aria-describedby="search-dialog-description"
                scroll={"paper"}
            >
                <DialogTitle id="search-dialog-title" sx={{ backgroundColor: "#313131", color: "white" }}>
                    <div className='flex justify-center items-center gap-2'>
                        <SearchInput placeholder="Search..." variant='standard' onChange={(e) => { setSearchQuery(e.target.value) }} ></SearchInput>
                        <Search sx={{ color: '#fff', mr: 1, my: 0.5 }} />
                    </div>
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "#313131", color: "white" }}>
                    <ul className="flex flex-wrap gap-4 justify-center">
                        {searchResults.data.Page.media.slice(0,12).map((media)=>(<Link to={`/anime/${media.id}`} key={media.id} onClick={() => {setDialogOpen(false); setSearchQuery("")}}><li className=' w-96 h-20'><ButtonBase sx={{justifyContent:"flex-start"}} className='flex text-xl gap-4 w-full bg-offWhite-600'><img className="h-20" src={media.coverImage.medium} /> <div className=''>{media.title.userPreferred}</div></ButtonBase></li></Link>))}
                    </ul>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default SearchAnime